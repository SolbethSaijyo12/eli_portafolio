<?php
// Configuración de headers para CORS y JSON
header('Content-Type: text/plain; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Verificar que sea una petición POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405);
    echo "Método no permitido";
    exit;
}

// Función para limpiar y validar datos
function limpiarDato($dato) {
    return htmlspecialchars(strip_tags(trim($dato)));
}

function validarEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Obtener y limpiar datos del formulario
$nombre = isset($_POST["nombre"]) ? limpiarDato($_POST["nombre"]) : '';
$email = isset($_POST["email"]) ? limpiarDato($_POST["email"]) : '';
$telefono = isset($_POST["telefono"]) ? limpiarDato($_POST["telefono"]) : '';
$empresa = isset($_POST["empresa"]) ? limpiarDato($_POST["empresa"]) : '';
$asunto = isset($_POST["asunto"]) ? limpiarDato($_POST["asunto"]) : '';
$mensaje = isset($_POST["mensaje"]) ? limpiarDato($_POST["mensaje"]) : '';

// Validaciones
$errores = [];

if (empty($nombre)) {
    $errores[] = "El nombre es obligatorio";
}

if (empty($email)) {
    $errores[] = "El email es obligatorio";
} elseif (!validarEmail($email)) {
    $errores[] = "El email no tiene un formato válido";
}

if (empty($asunto)) {
    $errores[] = "El asunto es obligatorio";
}

if (empty($mensaje)) {
    $errores[] = "El mensaje es obligatorio";
}

// Si hay errores, mostrarlos
if (!empty($errores)) {
    echo "Por favor corrige los siguientes errores:\n" . implode("\n", $errores);
    exit;
}

// Configuración del email
$destinatario = "e.elizabeth.jmnz12@gmail.com";
$email_asunto = "Nuevo mensaje desde el portafolio: " . $asunto;

// Crear el cuerpo del email en HTML
$email_cuerpo = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #951b81, #ba8f9e); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #951b81; }
        .value { margin-top: 5px; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Nuevo mensaje desde tu portafolio</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Nombre:</div>
                <div class='value'>" . htmlspecialchars($nombre) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'>" . htmlspecialchars($email) . "</div>
            </div>";

if (!empty($telefono)) {
    $email_cuerpo .= "
            <div class='field'>
                <div class='label'>Teléfono:</div>
                <div class='value'>" . htmlspecialchars($telefono) . "</div>
            </div>";
}

if (!empty($empresa)) {
    $email_cuerpo .= "
            <div class='field'>
                <div class='label'>Empresa:</div>
                <div class='value'>" . htmlspecialchars($empresa) . "</div>
            </div>";
}

$email_cuerpo .= "
            <div class='field'>
                <div class='label'>Asunto:</div>
                <div class='value'>" . htmlspecialchars($asunto) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Mensaje:</div>
                <div class='value'>" . nl2br(htmlspecialchars($mensaje)) . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Fecha y hora:</div>
                <div class='value'>" . date('d/m/Y H:i:s') . "</div>
            </div>
        </div>
        <div class='footer'>
            Este mensaje fue enviado desde el formulario de contacto de tu portafolio web.
        </div>
    </div>
</body>
</html>";

// Headers para email HTML
$headers = array(
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: ' . $nombre . ' <' . $email . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion()
);

// Intentar enviar el email
try {
    $enviado = mail($destinatario, $email_asunto, $email_cuerpo, implode("\r\n", $headers));
    
    if ($enviado) {
        // Log del mensaje enviado (opcional)
        $log_entry = date('Y-m-d H:i:s') . " - Mensaje enviado desde: " . $email . " - Asunto: " . $asunto . "\n";
        file_put_contents('contact_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
        
        echo "¡Gracias por contactarme! Tu mensaje ha sido enviado correctamente. Te responderé lo antes posible.";
    } else {
        throw new Exception("Error al enviar el email");
    }
    
} catch (Exception $e) {
    // En caso de error, también intentar guardar en archivo
    $backup_file = 'mensajes_backup.txt';
    $backup_content = "
=== MENSAJE RECIBIDO ===
Fecha: " . date('Y-m-d H:i:s') . "
Nombre: " . $nombre . "
Email: " . $email . "
Teléfono: " . $telefono . "
Empresa: " . $empresa . "
Asunto: " . $asunto . "
Mensaje: " . $mensaje . "
========================

";
    
    file_put_contents($backup_file, $backup_content, FILE_APPEND | LOCK_EX);
    
    echo "Tu mensaje ha sido recibido y guardado. Aunque hubo un problema técnico con el envío automático, me pondré en contacto contigo pronto.";
}
?>