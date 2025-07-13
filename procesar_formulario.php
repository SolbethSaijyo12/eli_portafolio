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
} elseif (strlen($mensaje) < 10) {
    $errores[] = "El mensaje debe tener al menos 10 caracteres";
}

// Si hay errores, mostrarlos
if (!empty($errores)) {
    echo "Por favor corrige los siguientes errores:\n" . implode("\n", $errores);
    exit;
}

// Configuración del email
$destinatario = "e.elizabeth.jmnz12@gmail.com";
$email_asunto = "💌 Nuevo mensaje desde tu portafolio: " . $asunto;

// Crear el cuerpo del email en HTML con diseño mejorado
$email_cuerpo = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #4a4a4a; 
            margin: 0; 
            padding: 0; 
            background: linear-gradient(135deg, #faf8fc 0%, #f0e6f7 100%);
        }
        .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 20px; 
            overflow: hidden; 
            box-shadow: 0 15px 35px rgba(216, 167, 202, 0.25);
        }
        .header { 
            background: linear-gradient(135deg, #d8a7ca, #c8a2c8); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .content { 
            padding: 30px; 
        }
        .field { 
            margin-bottom: 20px; 
            padding: 15px;
            background: #faf8fc;
            border-radius: 12px;
            border-left: 4px solid #d8a7ca;
        }
        .label { 
            font-weight: bold; 
            color: #d8a7ca; 
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
            display: block;
        }
        .value { 
            color: #4a4a4a;
            font-size: 16px;
            line-height: 1.5;
        }
        .footer { 
            background: #4a4a4a; 
            color: white; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
        }
        .emoji {
            font-size: 18px;
            margin-right: 8px;
        }
        .highlight {
            background: linear-gradient(135deg, #d8a7ca, #c8a2c8);
            color: white;
            padding: 2px 8px;
            border-radius: 6px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>💌 Nuevo mensaje desde tu portafolio</h1>
            <p style='margin: 10px 0 0 0; opacity: 0.9;'>¡Tienes una nueva consulta!</p>
        </div>
        <div class='content'>
            <div class='field'>
                <span class='label'><span class='emoji'>👤</span>Nombre:</span>
                <div class='value'>" . htmlspecialchars($nombre) . "</div>
            </div>
            
            <div class='field'>
                <span class='label'><span class='emoji'>📧</span>Email:</span>
                <div class='value'><a href='mailto:" . htmlspecialchars($email) . "' style='color: #d8a7ca; text-decoration: none;'>" . htmlspecialchars($email) . "</a></div>
            </div>";

if (!empty($telefono)) {
    $email_cuerpo .= "
            <div class='field'>
                <span class='label'><span class='emoji'>📱</span>Teléfono:</span>
                <div class='value'>" . htmlspecialchars($telefono) . "</div>
            </div>";
}

if (!empty($empresa)) {
    $email_cuerpo .= "
            <div class='field'>
                <span class='label'><span class='emoji'>🏢</span>Empresa:</span>
                <div class='value'>" . htmlspecialchars($empresa) . "</div>
            </div>";
}

$email_cuerpo .= "
            <div class='field'>
                <span class='label'><span class='emoji'>🏷️</span>Asunto:</span>
                <div class='value'><span class='highlight'>" . htmlspecialchars($asunto) . "</span></div>
            </div>
            
            <div class='field'>
                <span class='label'><span class='emoji'>💬</span>Mensaje:</span>
                <div class='value'>" . nl2br(htmlspecialchars($mensaje)) . "</div>
            </div>
            
            <div class='field'>
                <span class='label'><span class='emoji'>🕒</span>Fecha y hora:</span>
                <div class='value'>" . date('d/m/Y H:i:s') . " (Hora de México)</div>
            </div>
        </div>
        <div class='footer'>
            <p>Este mensaje fue enviado desde el formulario de contacto de tu portafolio web.</p>
            <p style='margin-top: 10px; opacity: 0.8;'>🌟 ¡Responde pronto para mantener una excelente comunicación!</p>
        </div>
    </div>
</body>
</html>";

// Headers para email HTML
$headers = array(
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: Portafolio Web <noreply@portafolio.com>',
    'Reply-To: ' . $nombre . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion(),
    'X-Priority: 1',
    'Importance: High'
);

// Función para guardar en base de datos (opcional)
function guardarEnBaseDatos($nombre, $email, $telefono, $empresa, $asunto, $mensaje) {
    try {
        // Configuración de la base de datos (ajustar según tu configuración)
        $host = 'localhost';
        $dbname = 'portafolio_contactos';
        $username = 'root';
        $password = '';
        
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $sql = "INSERT INTO contactos (nombre, email, telefono, empresa, asunto, mensaje, fecha_envio) 
                VALUES (:nombre, :email, :telefono, :empresa, :asunto, :mensaje, NOW())";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nombre' => $nombre,
            ':email' => $email,
            ':telefono' => $telefono,
            ':empresa' => $empresa,
            ':asunto' => $asunto,
            ':mensaje' => $mensaje
        ]);
        
        return true;
    } catch (PDOException $e) {
        // Log del error pero no mostrar al usuario
        error_log("Error en base de datos: " . $e->getMessage());
        return false;
    }
}

// Intentar enviar el email
try {
    $enviado = mail($destinatario, $email_asunto, $email_cuerpo, implode("\r\n", $headers));
    
    if ($enviado) {
        // Intentar guardar en base de datos (opcional)
        guardarEnBaseDatos($nombre, $email, $telefono, $empresa, $asunto, $mensaje);
        
        // Log del mensaje enviado
        $log_entry = date('Y-m-d H:i:s') . " - ✅ Mensaje enviado desde: " . $email . " - Asunto: " . $asunto . " - Nombre: " . $nombre . "\n";
        file_put_contents('contact_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
        
        echo "¡Gracias por contactarme, " . $nombre . "! 🎉 Tu mensaje ha sido enviado correctamente. Te responderé lo antes posible a tu correo " . $email . ".";
    } else {
        throw new Exception("Error al enviar el email");
    }
    
} catch (Exception $e) {
    // En caso de error, también intentar guardar en archivo
    $backup_file = 'mensajes_backup.txt';
    $backup_content = "
=== 📧 MENSAJE RECIBIDO ===
Fecha: " . date('Y-m-d H:i:s') . "
Nombre: " . $nombre . "
Email: " . $email . "
Teléfono: " . $telefono . "
Empresa: " . $empresa . "
Asunto: " . $asunto . "
Mensaje: " . $mensaje . "
IP: " . $_SERVER['REMOTE_ADDR'] . "
User Agent: " . $_SERVER['HTTP_USER_AGENT'] . "
========================

";
    
    file_put_contents($backup_file, $backup_content, FILE_APPEND | LOCK_EX);
    
    // Log del error
    $error_log = date('Y-m-d H:i:s') . " - ❌ Error enviando email: " . $e->getMessage() . " - De: " . $email . "\n";
    file_put_contents('error_log.txt', $error_log, FILE_APPEND | LOCK_EX);
    
    echo "Tu mensaje ha sido recibido y guardado, " . $nombre . ". Aunque hubo un problema técnico con el envío automático, me pondré en contacto contigo pronto a " . $email . ".";
}

// Script SQL para crear la tabla de contactos (ejecutar una sola vez)
/*
CREATE DATABASE IF NOT EXISTS portafolio_contactos;
USE portafolio_contactos;

CREATE TABLE IF NOT EXISTS contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    empresa VARCHAR(255),
    asunto VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    INDEX idx_email (email),
    INDEX idx_fecha (fecha_envio)
);
*/
?>