<?php

declare(strict_types=1);

use Dotenv\Dotenv;

require dirname(__DIR__) . '/vendor/autoload.php';

Dotenv::createImmutable(dirname(__DIR__))->safeLoad();

$rootDir = dirname(dirname(__DIR__));
$baseDir = dirname(__DIR__);
$timestamp = gmdate('Ymd-His');
$options = getopt('', [
    'source::',
    'legacy-uploads::',
    'report::',
    'force',
]);

$sourcePath = $options['source'] ?? ($rootDir . '/backend/prisma/dev.db');
$legacyUploadsDir = $options['legacy-uploads'] ?? ($rootDir . '/backend/uploads');
$reportPath = $options['report'] ?? ($baseDir . '/storage/app/migration-reports/legacy-sqlite-import-' . $timestamp . '.json');
$force = array_key_exists('force', $options);

$backupDir = $baseDir . '/storage/app/migration-backups/' . $timestamp;
$targetUploadsDir = $baseDir . '/uploads';

$tables = [
    [
        'source' => 'User',
        'target' => 'User',
        'columns' => ['id', 'username', 'passwordHash', 'fullName', 'email', 'role', 'createdAt', 'updatedAt'],
    ],
    [
        'source' => 'MembershipApplication',
        'target' => 'MembershipApplication',
        'columns' => [
            'id',
            'applicantId',
            'fullName',
            'email',
            'phone',
            'nationalIdNumber',
            'membershipGrade',
            'organizationName',
            'yearsOfExperience',
            'declarationAccepted',
            'bio',
            'stage',
            'decision',
            'rejectionReason',
            'registrationNumber',
            'certificateNumber',
            'validUntil',
            'createdAt',
            'updatedAt',
        ],
    ],
    [
        'source' => 'MembershipDocument',
        'target' => 'MembershipDocument',
        'columns' => ['id', 'applicationId', 'type', 'fileName', 'createdAt'],
    ],
    [
        'source' => 'ReviewLog',
        'target' => 'ReviewLog',
        'columns' => ['id', 'applicationId', 'action', 'notes', 'performedBy', 'createdAt'],
    ],
    [
        'source' => 'Renewal',
        'target' => 'Renewal',
        'columns' => ['id', 'applicationId', 'requestedAt', 'cpdCredits', 'feePaid', 'status', 'decisionNotes', 'approvedUntil'],
    ],
    [
        'source' => 'DisciplinaryAction',
        'target' => 'DisciplinaryAction',
        'columns' => ['id', 'applicationId', 'type', 'reason', 'startDate', 'endDate', 'createdBy', 'createdAt'],
    ],
    [
        'source' => 'EmailNotificationLog',
        'target' => 'EmailNotificationLog',
        'columns' => [
            'id',
            'applicationId',
            'type',
            'recipientEmail',
            'subject',
            'status',
            'attempts',
            'providerMessageId',
            'errorMessage',
            'sentAt',
            'createdAt',
            'updatedAt',
        ],
    ],
    [
        'source' => 'OrganizationApplication',
        'target' => 'OrganizationApplication',
        'columns' => [
            'id',
            'organizationName',
            'organizationType',
            'registrationNumber',
            'contactPerson',
            'contactEmail',
            'contactPhone',
            'legalStatusConfirmed',
            'createdAt',
        ],
    ],
    [
        'source' => 'Announcement',
        'target' => 'Announcement',
        'columns' => ['id', 'title', 'body', 'channel', 'createdAt'],
    ],
];

$boolColumns = [
    'MembershipApplication' => ['declarationAccepted'],
    'Renewal' => ['feePaid'],
    'OrganizationApplication' => ['legalStatusConfirmed'],
];

$intColumns = [
    'MembershipApplication' => ['yearsOfExperience'],
    'Renewal' => ['cpdCredits'],
    'EmailNotificationLog' => ['attempts'],
];

$dateColumns = [
    'User' => ['createdAt', 'updatedAt'],
    'MembershipApplication' => ['validUntil', 'createdAt', 'updatedAt'],
    'MembershipDocument' => ['createdAt'],
    'ReviewLog' => ['createdAt'],
    'Renewal' => ['requestedAt', 'approvedUntil'],
    'DisciplinaryAction' => ['startDate', 'endDate', 'createdAt'],
    'EmailNotificationLog' => ['sentAt', 'createdAt', 'updatedAt'],
    'OrganizationApplication' => ['createdAt'],
    'Announcement' => ['createdAt'],
];

function envValue(string $key, ?string $default = null): ?string
{
    $value = getenv($key);
    if ($value !== false) {
        return $value;
    }

    if (array_key_exists($key, $_ENV)) {
        return (string) $_ENV[$key];
    }

    if (array_key_exists($key, $_SERVER)) {
        return (string) $_SERVER[$key];
    }

    return $default;
}

function ensure(bool $condition, string $message): void
{
    if (! $condition) {
        throw new RuntimeException($message);
    }
}

function normalizeBoolean(mixed $value): int
{
    if ($value === null || $value === '') {
        return 0;
    }

    if (is_bool($value)) {
        return $value ? 1 : 0;
    }

    if (is_numeric($value)) {
        return ((int) $value) !== 0 ? 1 : 0;
    }

    $normalized = strtolower(trim((string) $value));

    return in_array($normalized, ['1', 'true', 'yes', 'on'], true) ? 1 : 0;
}

function normalizeInteger(mixed $value): ?int
{
    if ($value === null || $value === '') {
        return null;
    }

    return (int) $value;
}

function normalizeDateTime(mixed $value): ?string
{
    if ($value === null || $value === '') {
        return null;
    }

    if (is_int($value) || (is_string($value) && preg_match('/^\d+$/', $value))) {
        return gmdate('Y-m-d H:i:s', (int) $value);
    }

    try {
        $date = new DateTimeImmutable((string) $value);
    } catch (Throwable $exception) {
        throw new RuntimeException('Unable to parse datetime value: ' . (string) $value, 0, $exception);
    }

    return $date->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d H:i:s');
}

function buildPdoSqlite(string $sourcePath): PDO
{
    $pdo = new PDO('sqlite:' . $sourcePath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    return $pdo;
}

function buildPdoMysql(): PDO
{
    $host = envValue('DB_HOST', '127.0.0.1');
    $port = envValue('DB_PORT', '3306');
    $database = envValue('DB_DATABASE');
    $username = envValue('DB_USERNAME');
    $password = envValue('DB_PASSWORD', '');

    ensure($database !== null && $database !== '', 'DB_DATABASE must be set in backend-laravel/.env');
    ensure($username !== null && $username !== '', 'DB_USERNAME must be set in backend-laravel/.env');

    $pdo = new PDO(
        sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $database),
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    $pdo->exec("SET time_zone = '+00:00'");

    return $pdo;
}

function fetchSourceCounts(PDO $sqlite, array $tables): array
{
    $counts = [];

    foreach ($tables as $table) {
        $counts[$table['source']] = (int) $sqlite->query(
            sprintf('SELECT COUNT(*) FROM [%s]', $table['source'])
        )->fetchColumn();
    }

    return $counts;
}

function fetchTargetCounts(PDO $mysql, array $tables): array
{
    $counts = [];

    foreach ($tables as $table) {
        $counts[$table['target']] = (int) $mysql->query(
            sprintf('SELECT COUNT(*) FROM `%s`', $table['target'])
        )->fetchColumn();
    }

    return $counts;
}

function fetchTargetVarcharLimits(PDO $mysql): array
{
    $stmt = $mysql->query("
        SELECT LOWER(TABLE_NAME) AS table_name, COLUMN_NAME, CHARACTER_MAXIMUM_LENGTH
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND DATA_TYPE IN ('varchar', 'char')
    ");

    $limits = [];

    foreach ($stmt as $row) {
        $limits[$row['table_name']][$row['COLUMN_NAME']] = (int) $row['CHARACTER_MAXIMUM_LENGTH'];
    }

    return $limits;
}

function checkSourceFileIntegrity(PDO $sqlite, string $legacyUploadsDir): array
{
    $missing = [];
    $files = [];

    $stmt = $sqlite->query('SELECT fileName FROM [MembershipDocument]');
    while ($row = $stmt->fetch()) {
        $fileName = basename((string) $row['fileName']);
        if ($fileName === '') {
            continue;
        }

        $files[$fileName] = true;
    }

    foreach (array_keys($files) as $fileName) {
        $fullPath = rtrim($legacyUploadsDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $fileName;
        if (! is_file($fullPath)) {
            $missing[] = $fileName;
        }
    }

    sort($missing);

    return [
        'referencedFiles' => array_keys($files),
        'missingFiles' => $missing,
    ];
}

function checkLengthConstraints(PDO $sqlite, array $tables, array $targetVarcharLimits): array
{
    $violations = [];

    foreach ($tables as $table) {
        $targetKey = strtolower($table['target']);
        if (! isset($targetVarcharLimits[$targetKey])) {
            continue;
        }

        foreach ($targetVarcharLimits[$targetKey] as $column => $limit) {
            if (! in_array($column, $table['columns'], true)) {
                continue;
            }

            $query = sprintf('SELECT MAX(LENGTH(CAST([%s] AS TEXT))) FROM [%s]', $column, $table['source']);
            $maxLength = (int) $sqlite->query($query)->fetchColumn();

            if ($maxLength > $limit) {
                $violations[] = [
                    'table' => $table['source'],
                    'column' => $column,
                    'maxLength' => $maxLength,
                    'limit' => $limit,
                ];
            }
        }
    }

    return $violations;
}

function normalizeRow(array $row, string $sourceTable, array $boolColumns, array $intColumns, array $dateColumns): array
{
    foreach ($boolColumns[$sourceTable] ?? [] as $column) {
        if (array_key_exists($column, $row)) {
            $row[$column] = normalizeBoolean($row[$column]);
        }
    }

    foreach ($intColumns[$sourceTable] ?? [] as $column) {
        if (array_key_exists($column, $row)) {
            $row[$column] = normalizeInteger($row[$column]);
        }
    }

    foreach ($dateColumns[$sourceTable] ?? [] as $column) {
        if (array_key_exists($column, $row)) {
            $row[$column] = normalizeDateTime($row[$column]);
        }
    }

    return $row;
}

function copyReferencedFiles(array $fileNames, string $legacyUploadsDir, string $targetUploadsDir): array
{
    if (! is_dir($targetUploadsDir) && ! mkdir($targetUploadsDir, 0777, true) && ! is_dir($targetUploadsDir)) {
        throw new RuntimeException('Unable to create target uploads directory: ' . $targetUploadsDir);
    }

    $copied = 0;

    foreach ($fileNames as $fileName) {
        $source = rtrim($legacyUploadsDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $fileName;
        $target = rtrim($targetUploadsDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $fileName;

        if (! is_file($source)) {
            continue;
        }

        if (! copy($source, $target)) {
            throw new RuntimeException('Failed to copy upload file: ' . $fileName);
        }

        $copied += 1;
    }

    return [
        'copiedFiles' => $copied,
        'targetUploadsDir' => $targetUploadsDir,
    ];
}

function buildInsertStatement(PDO $mysql, string $table, array $columns): PDOStatement
{
    $quotedColumns = array_map(static fn (string $column): string => sprintf('`%s`', $column), $columns);
    $placeholders = array_map(static fn (string $column): string => ':' . $column, $columns);

    return $mysql->prepare(sprintf(
        'INSERT INTO `%s` (%s) VALUES (%s)',
        $table,
        implode(', ', $quotedColumns),
        implode(', ', $placeholders)
    ));
}

try {
    ensure(is_file($sourcePath), 'SQLite source database not found at ' . $sourcePath);
    ensure(is_dir($legacyUploadsDir), 'Legacy uploads directory not found at ' . $legacyUploadsDir);

    $sqlite = buildPdoSqlite($sourcePath);
    $mysql = buildPdoMysql();

    $sourceCounts = fetchSourceCounts($sqlite, $tables);
    $targetCountsBefore = fetchTargetCounts($mysql, $tables);
    $targetTotalBefore = array_sum($targetCountsBefore);

    if ($targetTotalBefore > 0 && ! $force) {
        throw new RuntimeException(
            'Target MySQL database is not empty. Re-run with --force only if you intend to replace its contents.'
        );
    }

    $fileIntegrity = checkSourceFileIntegrity($sqlite, $legacyUploadsDir);
    ensure(
        $fileIntegrity['missingFiles'] === [],
        'Referenced upload files are missing in legacy uploads: ' . implode(', ', $fileIntegrity['missingFiles'])
    );

    $lengthViolations = checkLengthConstraints($sqlite, $tables, fetchTargetVarcharLimits($mysql));
    ensure(
        $lengthViolations === [],
        'Source data exceeds MySQL varchar limits: ' . json_encode($lengthViolations, JSON_THROW_ON_ERROR)
    );

    if (! is_dir($backupDir) && ! mkdir($backupDir, 0777, true) && ! is_dir($backupDir)) {
        throw new RuntimeException('Unable to create backup directory: ' . $backupDir);
    }

    if (! copy($sourcePath, $backupDir . '/source-dev.db')) {
        throw new RuntimeException('Unable to back up SQLite source database.');
    }

    file_put_contents(
        $backupDir . '/target-counts-before.json',
        json_encode($targetCountsBefore, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR)
    );

    $mysql->exec('SET FOREIGN_KEY_CHECKS=0');
    $mysql->beginTransaction();

    for ($i = count($tables) - 1; $i >= 0; $i -= 1) {
        $mysql->exec(sprintf('DELETE FROM `%s`', $tables[$i]['target']));
    }

    foreach ($tables as $table) {
        $reader = $sqlite->query(sprintf('SELECT * FROM [%s]', $table['source']));
        $writer = buildInsertStatement($mysql, $table['target'], $table['columns']);

        while ($row = $reader->fetch()) {
            $normalized = normalizeRow($row, $table['source'], $boolColumns, $intColumns, $dateColumns);

            $payload = [];
            foreach ($table['columns'] as $column) {
                $payload[$column] = $normalized[$column] ?? null;
            }

            $writer->execute($payload);
        }
    }

    $mysql->commit();
    $mysql->exec('SET FOREIGN_KEY_CHECKS=1');

    $fileCopy = copyReferencedFiles($fileIntegrity['referencedFiles'], $legacyUploadsDir, $targetUploadsDir);
    $targetCountsAfter = fetchTargetCounts($mysql, $tables);

    $report = [
        'status' => 'ok',
        'sourcePath' => realpath($sourcePath) ?: $sourcePath,
        'legacyUploadsDir' => realpath($legacyUploadsDir) ?: $legacyUploadsDir,
        'targetUploadsDir' => $fileCopy['targetUploadsDir'],
        'sourceCounts' => $sourceCounts,
        'targetCountsBefore' => $targetCountsBefore,
        'targetCountsAfter' => $targetCountsAfter,
        'copiedFiles' => $fileCopy['copiedFiles'],
        'backups' => [
            'directory' => $backupDir,
            'sourceCopy' => $backupDir . '/source-dev.db',
            'targetCountsBefore' => $backupDir . '/target-counts-before.json',
        ],
        'reportGeneratedAt' => gmdate(DATE_ATOM),
    ];

    $reportDir = dirname($reportPath);
    if (! is_dir($reportDir) && ! mkdir($reportDir, 0777, true) && ! is_dir($reportDir)) {
        throw new RuntimeException('Unable to create report directory: ' . $reportDir);
    }

    file_put_contents($reportPath, json_encode($report, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));

    echo json_encode($report, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR), PHP_EOL;
    exit(0);
} catch (Throwable $exception) {
    if (isset($mysql) && $mysql instanceof PDO) {
        try {
            if ($mysql->inTransaction()) {
                $mysql->rollBack();
            }
            $mysql->exec('SET FOREIGN_KEY_CHECKS=1');
        } catch (Throwable) {
        }
    }

    fwrite(STDERR, '[legacy-migration] ' . $exception->getMessage() . PHP_EOL);
    exit(1);
}
