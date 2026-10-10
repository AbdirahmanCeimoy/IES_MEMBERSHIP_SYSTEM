<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Confirm your IES newsletter subscription</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:24px 0">
  <tr><td align="center">
    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 6px rgba(15,23,42,0.08)">
      <tr>
        <td style="background:#035CB3;padding:20px 24px;color:#ffffff;font-weight:bold;font-size:18px">
          Institution of Engineers Somalia (IES)
        </td>
      </tr>
      <tr>
        <td style="padding:28px 24px;font-size:15px;line-height:1.6">
          <h1 style="margin:0 0 12px 0;font-size:20px;color:#022D5A">Confirm your subscription</h1>
          <p style="margin:0 0 16px 0">
            Thanks for subscribing to the IES newsletter! Please confirm your email address so we can start sending you updates on news, events, and publications.
          </p>
          <p style="margin:24px 0;text-align:center">
            <a href="{{ $confirmUrl }}" style="display:inline-block;background:#48C184;color:#ffffff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:15px">Confirm my subscription</a>
          </p>
          <p style="margin:0 0 8px 0;color:#475569;font-size:13px">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="margin:0 0 20px 0;word-break:break-all;color:#035CB3;font-size:12px">
            <a href="{{ $confirmUrl }}" style="color:#035CB3">{{ $confirmUrl }}</a>
          </p>
          <p style="margin:0;font-size:12px;color:#64748b">
            This confirmation link expires in 7 days. If you did not request this, you can safely ignore this email or
            <a href="{{ $unsubscribeUrl }}" style="color:#035CB3">unsubscribe here</a>.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;background:#f1f5f9;color:#475569;font-size:12px;line-height:1.5">
          You received this because {{ $email }} was entered on the IES website.<br>
          &copy; {{ date('Y') }} Institution of Engineers Somalia
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>
