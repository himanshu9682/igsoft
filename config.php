<?php
define('RECIPIENT_EMAIL', 'hello@igsoft.studio');
define('SITE_NAME',       'iGsoft');
define('LOG_FILE',        __DIR__ . '/logs/submissions.log');

function session_init(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_name('IGSESS');
        session_set_cookie_params(['httponly' => true, 'samesite' => 'Strict']);
        session_start();
    }
}

/* CSRF */
function csrf_token(): string {
    session_init();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_verify(): void {
    session_init();
    $token = $_POST['csrf_token'] ?? ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    if (!hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
        http_response_code(403);
        json_response(false, 'Invalid request token.');
    }
}

/* Rate limit: max $max submissions per session per key */
function rate_limit(string $key, int $max = 3): bool {
    session_init();
    $_SESSION[$key] = ($_SESSION[$key] ?? 0) + 1;
    return $_SESSION[$key] <= $max;
}

function sanitize(string $val): string {
    return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
}

function json_response(bool $ok, string $message): void {
    if (!headers_sent()) {
        header('Content-Type: application/json');
    }
    echo json_encode(['ok' => $ok, 'message' => $message]);
    throw new RuntimeException($message, $ok ? 0 : 1);
}

/* Append submission to log file — path traversal guarded */
function log_submission(string $type, array $data): void {
    $dir     = dirname(LOG_FILE);
    if (!is_dir($dir)) mkdir($dir, 0750, true);
    $resolved = realpath($dir);
    $base     = realpath(__DIR__);
    if ($resolved === false || $base === false || strpos($resolved, $base) !== 0) {
        return; // refuse to write outside project directory
    }
    $line = date('Y-m-d H:i:s') . ' [' . strtoupper($type) . '] ' . json_encode($data) . PHP_EOL;
    file_put_contents(LOG_FILE, $line, FILE_APPEND | LOCK_EX);
}
