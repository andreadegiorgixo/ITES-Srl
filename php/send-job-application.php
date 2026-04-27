<?php

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito."]);
    exit;
}

$recipientEmail = "info@ites-srl.it";
$fromEmail = "info@ites-srl.it";
$fromName = "Sito ITES";
$maxAttachmentSize = 7 * 1024 * 1024;
$allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function sanitize_text($value)
{
    return trim((string) $value);
}

function json_error($message, $statusCode = 400)
{
    http_response_code($statusCode);
    echo json_encode(["message" => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

$candidateName = sanitize_text($_POST["candidateName"] ?? "");
$candidateEmail = sanitize_text($_POST["email"] ?? "");
$candidatePhone = sanitize_text($_POST["candidatePhone"] ?? "");
$candidateRole = sanitize_text($_POST["candidateRole"] ?? "");
$candidateSubject = sanitize_text($_POST["candidateSubject"] ?? "");
$candidateMessage = sanitize_text($_POST["candidateMessage"] ?? "");

if ($candidateName === "" || $candidateEmail === "" || $candidateRole === "" || $candidateSubject === "" || $candidateMessage === "") {
    json_error("Compila tutti i campi obbligatori.");
}

if (!filter_var($candidateEmail, FILTER_VALIDATE_EMAIL)) {
    json_error("Inserisci un indirizzo email valido.");
}

$attachment = null;

if (isset($_FILES["attachment"]) && $_FILES["attachment"]["error"] !== UPLOAD_ERR_NO_FILE) {
    if ($_FILES["attachment"]["error"] !== UPLOAD_ERR_OK) {
        json_error("Caricamento del CV non riuscito.");
    }

    if ((int) $_FILES["attachment"]["size"] > $maxAttachmentSize) {
        json_error("Il CV supera il limite di 7 MB.");
    }

    $tmpName = $_FILES["attachment"]["tmp_name"];
    $originalName = basename((string) $_FILES["attachment"]["name"]);

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = $finfo ? finfo_file($finfo, $tmpName) : null;

    if ($finfo) {
        finfo_close($finfo);
    }

    if (!$mimeType || !in_array($mimeType, $allowedMimeTypes, true)) {
        json_error("Il CV deve essere in formato PDF, DOC o DOCX.");
    }

    $fileContent = file_get_contents($tmpName);

    if ($fileContent === false) {
        json_error("Impossibile leggere il file allegato.");
    }

    $attachment = [
        "filename" => $originalName,
        "mimeType" => $mimeType,
        "content" => chunk_split(base64_encode($fileContent)),
    ];
}

$subject = $candidateSubject;
$boundary = "=_Part_" . md5((string) microtime(true));

$textBody = "Nuova candidatura dal sito ITES\r\n\r\n";
$textBody .= "Nome e cognome: " . $candidateName . "\r\n";
$textBody .= "Email: " . $candidateEmail . "\r\n";
$textBody .= "Telefono: " . ($candidatePhone !== "" ? $candidatePhone : "Non indicato") . "\r\n";
$textBody .= "Posizione di interesse: " . $candidateRole . "\r\n\r\n";
$textBody .= "Oggetto: " . $candidateSubject . "\r\n\r\n";
$textBody .= "Messaggio di presentazione:\r\n" . $candidateMessage . "\r\n";

$headers = [];
$headers[] = "MIME-Version: 1.0";
$headers[] = "From: " . $fromName . " <" . $fromEmail . ">";
$headers[] = "Reply-To: " . $candidateEmail;

if ($attachment) {
    $headers[] = "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"";

    $body = "--" . $boundary . "\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $body .= $textBody . "\r\n";
    $body .= "--" . $boundary . "\r\n";
    $body .= "Content-Type: " . $attachment["mimeType"] . "; name=\"" . $attachment["filename"] . "\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n";
    $body .= "Content-Disposition: attachment; filename=\"" . $attachment["filename"] . "\"\r\n\r\n";
    $body .= $attachment["content"] . "\r\n";
    $body .= "--" . $boundary . "--";
} else {
    $headers[] = "Content-Type: text/plain; charset=UTF-8";
    $body = $textBody;
}

$mailSent = mail(
    $recipientEmail,
    "=?UTF-8?B?" . base64_encode($subject) . "?=",
    $body,
    implode("\r\n", $headers)
);

if (!$mailSent) {
    json_error("Invio email non riuscito. Controlla la configurazione PHP del server.", 500);
}

echo json_encode([
    "success" => true,
    "message" => "Candidatura inviata con successo.",
], JSON_UNESCAPED_UNICODE);
