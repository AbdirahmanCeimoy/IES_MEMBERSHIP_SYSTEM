[CmdletBinding()]
param(
    [string]$ApiBase = 'http://127.0.0.1:8000/api'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Net.Http

$timestamp = Get-Date -Format 'yyyyMMddHHmmss'
$letters = -join ((1..8) | ForEach-Object { [char](Get-Random -Minimum 97 -Maximum 123) })
$username = "liveretry$letters"
$email = "liveretry.$timestamp@example.com"
$nationalId = ('9' + $timestamp.Substring($timestamp.Length - 10))
$password = 'Secure1234'

$root = Split-Path -Parent $PSScriptRoot
$uploads = Join-Path $root 'backend-laravel\uploads'

$idPassport = Join-Path $uploads '1773505596521-3e1a3bc8-46f2-4b1d-9efe-6eca0a7ae087-Bacground-Study-02.png'
$passportPhoto = Join-Path $uploads '1773505596525-939eb352-b57b-4f85-a1ba-61967759c390-maanka.jpg'
$pdfDoc = Join-Path $uploads '1773505596526-fadac6ae-3e89-4e5d-b459-11b95f644d6c-Garbage_Detection_and_Classification_System_for_Urban_Areas_.pdf'

foreach ($path in @($idPassport, $passportPhoto, $pdfDoc)) {
    if (-not (Test-Path $path)) {
        throw "Required sample file not found: $path"
    }
}

$signupBody = @{
    username = $username
    password = $password
    fullName = 'Live Retry Test'
    email = $email
} | ConvertTo-Json

$signupResponse = Invoke-RestMethod `
    -Uri "$ApiBase/auth/signup" `
    -Method Post `
    -ContentType 'application/json' `
    -Body $signupBody

if (-not $signupResponse.token) {
    throw 'Signup did not return a token.'
}

$multipart = [System.Net.Http.MultipartFormDataContent]::new()

function Add-StringPart {
    param(
        [System.Net.Http.MultipartFormDataContent]$Form,
        [string]$Name,
        [string]$Value
    )

    $Form.Add([System.Net.Http.StringContent]::new($Value), $Name)
}

function Add-FilePart {
    param(
        [System.Net.Http.MultipartFormDataContent]$Form,
        [string]$Name,
        [string]$Path,
        [string]$ContentType
    )

    $stream = [System.IO.File]::OpenRead($Path)
    $content = [System.Net.Http.StreamContent]::new($stream)
    $content.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse($ContentType)
    $Form.Add($content, $Name, [System.IO.Path]::GetFileName($Path))
}

Add-StringPart $multipart 'fullName' 'Live Retry Test'
Add-StringPart $multipart 'email' $email
Add-StringPart $multipart 'phone' '+252612000000'
Add-StringPart $multipart 'nationalIdNumber' $nationalId
Add-StringPart $multipart 'membershipGrade' 'STUDENT'
Add-StringPart $multipart 'yearsOfExperience' '0'
Add-StringPart $multipart 'declarationAccepted' 'true'
Add-StringPart $multipart 'bio' 'Live retry verification submission.'

Add-FilePart $multipart 'idOrPassportFileName' $idPassport 'image/png'
Add-FilePart $multipart 'passportPhotoFileName' $passportPhoto 'image/jpeg'
Add-FilePart $multipart 'cvFileName' $pdfDoc 'application/pdf'
Add-FilePart $multipart 'paymentProofFileName' $idPassport 'image/png'
Add-FilePart $multipart 'declarationFileName' $pdfDoc 'application/pdf'
Add-FilePart $multipart 'enrollmentProofFileName' $pdfDoc 'application/pdf'
Add-FilePart $multipart 'transcriptFileName' $pdfDoc 'application/pdf'

$handler = [System.Net.Http.HttpClientHandler]::new()
$client = [System.Net.Http.HttpClient]::new($handler)
$client.DefaultRequestHeaders.Authorization = [System.Net.Http.Headers.AuthenticationHeaderValue]::new('Bearer', [string]$signupResponse.token)

$response = $client.PostAsync("$ApiBase/memberships/applications", $multipart).GetAwaiter().GetResult()
$responseBody = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()

[PSCustomObject]@{
    username = $username
    email = $email
    nationalIdNumber = $nationalId
    statusCode = [int]$response.StatusCode
    responseBody = $responseBody
}
