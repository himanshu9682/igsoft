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

    if (!rate_limit('contact_submissions')) {
        http_response_code(429);
        json_response(false, 'Too many submissions. Please try again later.');
    }

    $name    = sanitize($_POST['name']    ?? '');
    $email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $message = sanitize($_POST['message'] ?? '');

    if (!$name || !$email || !$message) {
        json_response(false, 'Please fill in all required fields.');
    }

    if (strlen($name) > 100 || strlen($message) > 3000) {
        json_response(false, 'Input exceeds allowed length.');
    }

    log_submission('contact', ['name' => $name, 'email' => $email]);

    $subject = SITE_NAME . ' — New Contact Inquiry from ' . $name;
    $body    = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}";
    $headers = implode("\r\n", [
        'From: ' . SITE_NAME . ' <noreply@igsoft.studio>',
        'Reply-To: ' . $name . ' <' . $email . '>',
        'Content-Type: text/plain; charset=UTF-8',
        'X-Mailer: PHP/' . PHP_VERSION,
    ]);

    if (mail(RECIPIENT_EMAIL, $subject, $body, $headers)) {
        json_response(true, 'Thanks! We will reach out with next steps soon.');
    } else {
        http_response_code(500);
        json_response(false, 'Could not send your message. Please email us directly.');
    }
} catch (RuntimeException $e) {
    // json_response already sent output; suppress further output
}
