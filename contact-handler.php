<?php
// contact-handler.php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Sanitize and validate input data
    $name = filter_var(trim($_POST["name"]), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $subject = filter_var(trim($_POST["subject"]), FILTER_SANITIZE_STRING);
    $message = filter_var(trim($_POST["message"]), FILTER_SANITIZE_STRING);
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        header("Location: index.html?error=missing_fields");
        exit;
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: index.html?error=invalid_email");
        exit;
    }
    
    // Email configuration
    $to = "dmwendia30@gmail.com";
    $email_subject = "New Contact Form Submission: " . $subject;
    
    // Create email body
    $email_body = "You have received a new message from your website contact form.\n\n";
    $email_body .= "Name: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Subject: $subject\n\n";
    $email_body .= "Message:\n$message\n";
    
    // Email headers
    $headers = "From: Carol Kui <no-reply@yourdomain.com>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Send email
    if (mail($to, $email_subject, $email_body, $headers)) {
        // Success - redirect to thank you page or back to contact with success message
        header("Location: index.html?success=1");
    } else {
        // Error sending email
        error_log('Mail sending failed for contact form submission from ' . $email);
        header("Location: index.html?error=send_failed");
    }
    
    exit;
} else {
    // If not POST request, redirect to contact page
    header("Location: index.html");
    exit;
}
?>