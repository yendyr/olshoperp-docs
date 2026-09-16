<?php

/**
 * OlshopERP Laravel Log Debugger Runner Script (PHP)
 * 
 * Usage:
 *   php scripts/agent-log-fetch.php --server=tyas --file=laravel-2026-09-04.log --level=error --start=1 --end=50
 *   php scripts/agent-log-fetch.php --server=staging --file=laravel-2026-09-04.log --level=error --start=1 --end=50
 *   php scripts/agent-log-fetch.php --server=merdian --file=laravel-2026-09-04.log --level=error --start=1 --end=50
 */

function loadEnv($envPath) {
    if (!file_exists($envPath)) return [];
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || str_starts_with($line, '#')) continue;
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $key = trim($parts[0]);
            $val = trim($parts[1]);
            $val = trim($val, "\"'");
            $env[$key] = $val;
        }
    }
    return $env;
}

$possiblePaths = [
    __DIR__ . '/../.env',
    __DIR__ . '/../../.env',
    __DIR__ . '/../../olshoperp/.env',
    getcwd() . '/.env',
    getcwd() . '/olshoperp/.env',
    getcwd() . '/../olshoperp/.env',
    'd:/olshoperp/olshoperp/.env',
    'd:/olshoperp/.env'
];

$env = [];
foreach ($possiblePaths as $p) {
    if (file_exists($p)) {
        $env = loadEnv($p);
        break;
    }
}

$options = getopt("s:f:l:r", ["server:", "file:", "level:", "start:", "end:", "raw", "help"]);

if (isset($options['help'])) {
    echo "OlshopERP Agent Log Fetch Runner (PHP)\n";
    echo "Usage:\n";
    echo "  php scripts/agent-log-fetch.php [--server=tyas|staging|merdian] [--file=laravel-YYYY-MM-DD.log] [--level=error|warning|info|debug] [--start=1] [--end=50]\n";
    exit(0);
}

$today = date('Y-m-d');
$server = strtolower($options['server'] ?? $options['s'] ?? 'tyas');
$fileName = $options['file'] ?? $options['f'] ?? "laravel-{$today}.log";
$level = strtolower($options['level'] ?? $options['l'] ?? 'error');
$startLine = (int)($options['start'] ?? 1);
$endLine = (int)($options['end'] ?? 50);
$raw = isset($options['raw']) || isset($options['r']);

$validServers = ['tyas', 'staging', 'merdian'];
if (!in_array($server, $validServers)) {
    echo json_encode([
        'status' => 'error',
        'message' => "Server '{$server}' tidak valid. Pilihan valid: " . implode(', ', $validServers)
    ], JSON_PRETTY_PRINT) . "\n";
    exit(1);
}

$validLevels = ['debug', 'error', 'info', 'warning'];
if ($level && !in_array($level, $validLevels)) {
    echo json_encode([
        'status' => 'error',
        'message' => "Level '{$level}' tidak valid. Level yang didukung: " . implode(', ', $validLevels)
    ], JSON_PRETTY_PRINT) . "\n";
    exit(1);
}

$payload = [
    'file_name' => $fileName,
    'level' => $level,
    'startLine' => $startLine,
    'endLine' => $endLine
];

if ($server === 'merdian') {
    $webhookUrl = getenv('LOG_DEBUG_WEBHOOK_URL_MERDIAN') ?: ($env['LOG_DEBUG_WEBHOOK_URL_MERDIAN'] ?? 'https://n9n.olshoperp.com/webhook/agent-log-merdian');
} else {
    $webhookUrl = getenv('LOG_DEBUG_WEBHOOK_URL_TYAS') ?: ($env['LOG_DEBUG_WEBHOOK_URL_TYAS'] ?? 'https://n8n.olshoperp.com/webhook/agent-log-tyas');
    $payload['server'] = $server;
}

$apiKey = getenv('LOG_DEBUG_API_KEY') ?: ($env['LOG_DEBUG_API_KEY'] ?? ($env['DB_DEBUG_API_KEY'] ?? '$D3v3l0pm3nt'));

$ch = curl_init($webhookUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-API-Key: ' . $apiKey
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode([
        'status' => 'error',
        'statusCode' => $httpCode,
        'message' => "HTTP {$httpCode}",
        'detail' => $response ?: $error
    ], JSON_PRETTY_PRINT) . "\n";
    exit(1);
}

$data = json_decode($response, true) ?? $response;

if ($raw) {
    echo is_string($data) ? $data : json_encode($data, JSON_PRETTY_PRINT) . "\n";
} else {
    echo json_encode([
        'status' => 'success',
        'server' => $server,
        'file_name' => $fileName,
        'level' => $level,
        'startLine' => $startLine,
        'endLine' => $endLine,
        'payload' => $payload,
        'response' => $data
    ], JSON_PRETTY_PRINT) . "\n";
}
