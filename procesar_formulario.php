<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre  = strip_tags(trim($_POST["nombre"]));
    $email   = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $asunto  = trim($_POST["asunto"]);
    $mensaje = trim($_POST["mensaje"]);

    // Validar campos
    if (empty($nombre) || empty($email) || empty($mensaje) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Por favor, completa el formulario correctamente.";
        exit;
    }

    // Configurar email
    $destinatario = "castrojimenezcrisolelizabeth@gmail.com"; // Cambia esto a tu correo real
    $email_asunto = "Nuevo mensaje de $nombre: $asunto";
    $email_cuerpo = "Nombre: $nombre\n";
    $email_cuerpo .= "Email: $email\n\n";
    $email_cuerpo .= "Mensaje:\n$mensaje\n";
    $email_headers = "From: $nombre <$email>";

    // Enviar email
    if (mail($destinatario, $email_asunto, $email_cuerpo, $email_headers)) {
        echo "Gracias por contactarnos. Pronto te responderemos.";
    } else {
        echo "Lo sentimos, ha ocurrido un error.";
    }
}
?>