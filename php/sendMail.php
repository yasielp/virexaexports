<?php

declare(strict_types=1);

// ============================================================
//  CONFIGURACIÓN — Rellena estos valores antes de desplegar
// ============================================================
const SMTP_HOST     = 'smtp.office365.com';
const SMTP_PORT     = 587;
const SMTP_USERNAME = 'report@unicofreight.com';   // Cuenta Outlook que envía
const SMTP_PASSWORD = 'jbsqxpfnbfdfvzzj';         // Contraseña o App Password
const MAIL_FROM     = 'report@unicofreight.com';   // Mismo que SMTP_USERNAME
const MAIL_FROM_NAME = 'Virexa Contact Form'; // Nombre que verá el destinatario
const MAIL_TO       = 'info@weprovideillusion.com'; // Destinatario final
// ============================================================

header('Content-Type: application/json; charset=utf-8');

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
  exit;
}

// Recoger y sanear campos
$name     = trim(strip_tags($_POST['name']    ?? ''));
$email    = trim(strip_tags($_POST['email']   ?? ''));
$phone    = trim(strip_tags($_POST['phone']   ?? ''));
if ($phone !== '') {
  $phone = '+' . ltrim($phone, '+');
}
$company  = trim(strip_tags($_POST['company'] ?? ''));
$country  = trim(strip_tags($_POST['country'] ?? ''));
$interest = trim(strip_tags($_POST['interest'] ?? ''));
$message  = trim(strip_tags($_POST['message'] ?? ''));

// Validaciones básicas
if ($name === '' || $email === '' || $country === '' || $interest === '' || $message === '') {
  http_response_code(422);
  echo json_encode(['success' => false, 'message' => 'Rellena todos los campos obligatorios.']);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422);
  echo json_encode(['success' => false, 'message' => 'Correo electrónico inválido.']);
  exit;
}

// Autoloader de Composer (PHPMailer)
$autoload = __DIR__ . '/../vendor/autoload.php';
if (!file_exists($autoload)) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Error interno: dependencias no instaladas.']);
  exit;
}
require $autoload;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

try {
  $mail = new PHPMailer(true);

  // Servidor SMTP
  $mail->isSMTP();
  $mail->Host       = SMTP_HOST;
  $mail->SMTPAuth   = true;
  $mail->Username   = SMTP_USERNAME;
  $mail->Password   = SMTP_PASSWORD;
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  $mail->Port       = SMTP_PORT;
  $mail->CharSet    = 'UTF-8';

  // Remitente y destinatario
  $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
  $mail->addAddress(MAIL_TO);
  $mail->addReplyTo($email, $name);

  // Contenido
  $mail->isHTML(true);
  $mail->Subject = "Nuevo contacto de {$name} — Virexa Exports";

  $eName    = mb_strtoupper(htmlspecialchars($name,    ENT_QUOTES, 'UTF-8'), 'UTF-8');
  $eEmail   = htmlspecialchars($email,   ENT_QUOTES, 'UTF-8');
  $ePhone   = htmlspecialchars($phone,   ENT_QUOTES, 'UTF-8');
  $eCompany = mb_strtoupper(htmlspecialchars($company, ENT_QUOTES, 'UTF-8'), 'UTF-8');
  $eCountry = mb_strtoupper(htmlspecialchars($country, ENT_QUOTES, 'UTF-8'), 'UTF-8');
  $eInterest = mb_strtoupper(htmlspecialchars($interest, ENT_QUOTES, 'UTF-8'), 'UTF-8');
  $eMessage = nl2br(mb_strtoupper(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'), 'UTF-8'));

  $body = <<<HTML
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0c2e10;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c2e10;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.4);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#134817 0%,#1b6822 100%);padding:36px 40px 28px;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:3px;color:#c49010;text-transform:uppercase;">Virexa Exports General Trading FZCO</p>
            <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;">Nuevo mensaje de contacto</h1>
            <div style="width:48px;height:3px;background:#c49010;margin:16px auto 0;border-radius:2px;"></div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#f8f7f2;padding:36px 40px;">

            <!-- Intro -->
            <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.6;">
              Se ha recibido una nueva consulta a través del formulario de contacto de <strong>virexaexports.com</strong>.
            </p>

            <!-- Datos del contacto -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #e0ddd4;">

              <tr style="background:#134817;">
                <td colspan="2" style="padding:10px 18px;">
                  <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;color:#c49010;text-transform:uppercase;">Información del contacto</p>
                </td>
              </tr>

              <tr style="background:#ffffff;">
                <td style="padding:14px 18px;width:140px;font-size:12px;font-weight:700;color:#134817;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #ede9df;">Nombre</td>
                <td style="padding:14px 18px;font-size:14px;color:#1a1a1a;border-bottom:1px solid #ede9df;">{$eName}</td>
              </tr>
              <tr style="background:#faf9f5;">
                <td style="padding:14px 18px;font-size:12px;font-weight:700;color:#134817;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #ede9df;">Email</td>
                <td style="padding:14px 18px;font-size:14px;border-bottom:1px solid #ede9df;"><a href="mailto:{$eEmail}" style="color:#1b6822;text-decoration:none;font-weight:600;">{$eEmail}</a></td>
              </tr>
              <tr style="background:#ffffff;">
                <td style="padding:14px 18px;font-size:12px;font-weight:700;color:#134817;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #ede9df;">Teléfono</td>
                <td style="padding:14px 18px;font-size:14px;color:#1a1a1a;border-bottom:1px solid #ede9df;">{$ePhone}</td>
              </tr>
              <tr style="background:#faf9f5;">
                <td style="padding:14px 18px;font-size:12px;font-weight:700;color:#134817;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #ede9df;">Empresa</td>
                <td style="padding:14px 18px;font-size:14px;color:#1a1a1a;border-bottom:1px solid #ede9df;">{$eCompany}</td>
              </tr>
              <tr style="background:#ffffff;">
                <td style="padding:14px 18px;font-size:12px;font-weight:700;color:#134817;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #ede9df;">País</td>
                <td style="padding:14px 18px;font-size:14px;color:#1a1a1a;border-bottom:1px solid #ede9df;">{$eCountry}</td>
              </tr>
              <tr style="background:#faf9f5;">
                <td style="padding:14px 18px;font-size:12px;font-weight:700;color:#134817;text-transform:uppercase;letter-spacing:0.5px;">Interés</td>
                <td style="padding:14px 18px;">
                  <span style="display:inline-block;background:#c49010;color:#0c2e10;font-size:12px;font-weight:800;padding:6px 16px;border-radius:20px;letter-spacing:1px;">{$eInterest}</span>
                </td>
              </tr>
            </table>

            <!-- Mensaje -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border-radius:10px;overflow:hidden;border:1px solid #e0ddd4;">
              <tr style="background:#134817;">
                <td style="padding:10px 18px;">
                  <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;color:#c49010;text-transform:uppercase;">Mensaje</p>
                </td>
              </tr>
              <tr style="background:#ffffff;">
                <td style="padding:20px 18px;font-size:14px;color:#333;line-height:1.7;">{$eMessage}</td>
              </tr>
            </table>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
              <tr>
                <td align="center">
                  <a href="mailto:{$eEmail}" style="display:inline-block;background:linear-gradient(135deg,#c49010,#d9aa28);color:#0c2e10;font-size:14px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">Responder a {$eName}</a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#134817;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#c49010;letter-spacing:1px;">VIREXA EXPORTS GENERAL TRADING FZCO</p>
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">Dubai, Emiratos Árabes Unidos &nbsp;·&nbsp; virexaexports.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>
HTML;

  $mail->Body    = $body;
  $mail->AltBody = "Nombre: {$eName}\nEmail: {$eEmail}\nTeléfono: {$ePhone}\nEmpresa: {$eCompany}\nPaís: {$eCountry}\nInterés: {$eInterest}\n\nMensaje:\n{$message}";

  $mail->send();

  echo json_encode(['success' => true, 'message' => 'Mensaje enviado correctamente.']);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'No se pudo enviar el mensaje. Inténtelo de nuevo.']);
}
