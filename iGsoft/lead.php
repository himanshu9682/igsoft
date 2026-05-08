<?php
require_once __DIR__ . '/config.php';

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        json_response(false, 'Method not allowed.');
    }

    csrf_verify();

    if (!rate_limit('lead_submissions')) {
        http_response_code(429);
        json_response(false, 'Too many submissions. Please try again later.');
    }

    $name    = sanitize($_POST['name']    ?? '');
    $email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $phone   = sanitize($_POST['phone']   ?? '');
    $budget  = sanitize($_POST['budget']  ?? '');
    $service = sanitize($_POST['service'] ?? '');
    $message = sanitize($_POST['message'] ?? '');

    if (!$name || !$email) {
        json_response(false, 'Name and email are required.');
    }

    if (strlen($name) > 100 || strlen($message) > 5000) {
        json_response(false, 'Input exceeds allowed length.');
    }

    log_submission('lead', [
        'name'    => $name,
        'email'   => $email,
        'phone'   => $phone,
        'budget'  => $budget,
        'service' => $service,
    ]);

    $subject = SITE_NAME . ' — New Project Request from ' . $name;
    $body    = implode("\n", [
        "New project request received via igsoft.studio",
        str_repeat('-', 40),
        "Name:    {$name}",
        "Email:   {$email}",
        "Phone:   " . ($phone   ?: 'Not provided'),
        "Budget:  " . ($budget  ?: 'Not specified'),
        "Service: " . ($service ?: 'Not specified'),
        "",
        "Project Brief:",
        $message ?: 'No brief provided.',
    ]);

    $headers = implode("\r\n", [
        'From: ' . SITE_NAME . ' <noreply@igsoft.studio>',
        'Reply-To: ' . $name . ' <' . $email . '>',
        'Content-Type: text/plain; charset=UTF-8',
        'X-Mailer: PHP/' . PHP_VERSION,
    ]);

    if (mail(RECIPIENT_EMAIL, $subject, $body, $headers)) {
        json_response(true, '✓ Request sent! We\'ll reach out within 24 hours.');
    } else {
        http_response_code(500);
        json_response(false, 'Could not send your request. Please email us directly.');
    }
} catch (RuntimeException $e) {
    // json_response already sent output; suppress further output
}
