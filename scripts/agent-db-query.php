<?php

/**
 * OlshopERP Database Debugger Runner Script
 * 
 * Tool pembantu aman untuk query database production (tyas_olshoperp) / staging (staging_olshoperp) / merdian (merdian_olshoperp)
 * Membaca kredensial dari .env dan memberlakukan validasi STRICT READ-ONLY.
 * 
 * Usage:
 *   php scripts/agent-db-query.php --db=tyas_olshoperp --query="SELECT id, name, email FROM gate_users LIMIT 5"
 *   php scripts/agent-db-query.php --db=staging_olshoperp --query="SELECT * FROM audits WHERE auditable_id = 10"
 *   php scripts/agent-db-query.php --db=merdian_olshoperp --query="SELECT id, name, email FROM gate_users LIMIT 5"
 */

// 1. Cari dan muat file .env
function loadEnvFile(): array {
    $possiblePaths = [
        __DIR__ . '/../.env',
        __DIR__ . '/../../.env',
        __DIR__ . '/../../olshoperp/.env',
        getcwd() . '/.env',
        getcwd() . '/olshoperp/.env',
        getcwd() . '/../olshoperp/.env'
    ];

    $env = [];
    foreach ($possiblePaths as $path) {
        if (file_exists($path)) {
            $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line === '' || str_starts_with($line, '#')) {
                    continue;
                }
                if (str_contains($line, '=')) {
                    [$key, $val] = explode('=', $line, 2);
                    $key = trim($key);
                    $val = trim($val);
                    $val = trim($val, "\"'");
                    $env[$key] = $val;
                }
            }
            break;
        }
    }
    return $env;
}

$env = loadEnvFile();
$apiKey = $env['DB_DEBUG_API_KEY'] ?? getenv('DB_DEBUG_API_KEY') ?: '';

if (empty($apiKey)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'DB_DEBUG_API_KEY tidak ditemukan pada file .env!'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
    exit(1);
}

// 2. Parse command-line options
$options = getopt('q:d:l:f:rh', [
    'query:',
    'db:',
    'limit:',
    'format:',
    'raw',
    'help'
]);

if (isset($options['h']) || isset($options['help'])) {
    echo <<<HELP
OlshopERP Agent DB Query Runner
-------------------------------
Usage:
  php scripts/agent-db-query.php --query="<SQL_QUERY>" [--db=<DB_NAME>] [--limit=<NUM>] [--raw]

Options:
  --query, -q    SQL query to execute (Must be read-only: SELECT, EXPLAIN, DESCRIBE, SHOW)
  --db, -d       Target database (default: tyas_olshoperp, options: tyas_olshoperp, staging_olshoperp, merdian_olshoperp)
  --limit, -l    Force limit rows (default: 100 if no LIMIT is provided)
  --raw, -r      Output raw unformatted JSON response
  --format, -f   Output format: json (default) or table
  --help, -h     Show this help message

HELP;
    exit(0);
}

$query = $options['query'] ?? $options['q'] ?? null;
$db = $options['db'] ?? $options['d'] ?? 'tyas_olshoperp';
$limit = $options['limit'] ?? $options['l'] ?? null;
$isRaw = isset($options['raw']) || isset($options['r']);
$format = $options['format'] ?? $options['f'] ?? 'json';

if ($db === 'merdian_olshoperp') {
    $webhookUrl = $env['DB_DEBUG_WEBHOOK_URL_MERDIAN'] ?? getenv('DB_DEBUG_WEBHOOK_URL_MERDIAN') ?: 'https://n9n.olshoperp.com/webhook/agent-db-merdian';
} else {
    $webhookUrl = $env['DB_DEBUG_WEBHOOK_URL'] ?? getenv('DB_DEBUG_WEBHOOK_URL') ?: 'https://n8n.olshoperp.com/webhook/agent-db-tyas';
}

if (empty($query)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Parameter --query wajib diisi. Contoh: --query="SELECT * FROM gate_users LIMIT 5"'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
    exit(1);
}

$query = trim($query);

// 3. Strict Read-Only Guard
$cleanedQuery = preg_replace('/\s+/', ' ', $query);
$upperQuery = strtoupper($cleanedQuery);

// Validasi awalan kueri
if (!preg_match('/^(SELECT|EXPLAIN|DESCRIBE|SHOW|WITH)\b/i', $cleanedQuery)) {
    echo json_encode([
        'status' => 'error',
        'code' => 'MUTATION_BLOCKED',
        'message' => 'KEAMANAN: Hanya query READ-ONLY (SELECT, EXPLAIN, DESCRIBE, SHOW, WITH) yang diizinkan! Dilarang mengubah data.'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
    exit(1);
}

// Blokir mutasi berbahaya
$forbiddenKeywords = [
    'INSERT INTO', 'UPDATE ', 'DELETE FROM', 'DROP TABLE', 'DROP DATABASE',
    'ALTER TABLE', 'TRUNCATE TABLE', 'TRUNCATE ', 'REPLACE INTO', 'CREATE TABLE',
    'CREATE DATABASE', 'GRANT ', 'REVOKE ', 'FLUSH PRIVILEGES', 'SET PASSWORD',
    'INTO OUTFILE', 'INTO DUMPFILE'
];

foreach ($forbiddenKeywords as $forbidden) {
    if (stripos($upperQuery, $forbidden) !== false) {
        echo json_encode([
            'status' => 'error',
            'code' => 'FORBIDDEN_KEYWORD',
            'message' => "KEAMANAN: Query dibatalkan karena memuat keyword mutasi terlarang: {$forbidden}"
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
        exit(1);
    }
}

// 4. Auto-limit safeguard jika belum ada LIMIT pada SELECT
if ($limit !== null) {
    if (!preg_match('/\bLIMIT\s+\d+/i', $query)) {
        $query = rtrim($query, ';') . " LIMIT " . intval($limit);
    }
} elseif (preg_match('/^SELECT\b/i', $query) && !preg_match('/\bLIMIT\s+\d+/i', $query) && !preg_match('/\bCOUNT\s*\(/i', $query)) {
    $query = rtrim($query, ';') . " LIMIT 100";
}

// 5. Eksekusi Request ke n8n Webhook
$payload = json_encode([
    'query' => $query,
    'db' => $db
], JSON_UNESCAPED_SLASHES);

$ch = curl_init($webhookUrl);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'X-API-Key: ' . $apiKey
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 45,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false) {
    echo json_encode([
        'status' => 'error',
        'code' => 'CONNECTION_FAILED',
        'message' => "Gagal terhubung ke webhook n8n: {$curlError}"
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
    exit(1);
}

if ($isRaw) {
    echo $response . PHP_EOL;
    exit(0);
}

$decoded = json_decode($response, true);

if ($httpCode >= 400 || (is_array($decoded) && isset($decoded['error']))) {
    echo json_encode([
        'status' => 'error',
        'http_code' => $httpCode,
        'response' => $decoded ?: $response
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
    exit(1);
}

// 6. Format Output
if (is_array($decoded)) {
    $rowCount = count($decoded);
    $result = [
        'status' => 'success',
        'database' => $db,
        'query_executed' => $query,
        'total_rows' => $rowCount,
        'data' => $decoded
    ];
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL;
} else {
    echo $response . PHP_EOL;
}
