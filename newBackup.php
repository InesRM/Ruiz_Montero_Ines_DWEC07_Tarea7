<?php
// poner este json en xampp en la ruta htdocs/practica9js/crearfichero.php   http://localhost/practica9js/crearfichero.php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
if (isset($_FILES['jsonBlob'])) {

    // $ruta = 'http://127.0.0.1:5500/backup/';
    $ruta = 'C:\Users\user\OneDrive\Desktop\CLIENTE-ENLACES\UT07\proyectoRestaurante-usuarioslogin\proyectoRestaurante-master\backup/';
    $ruta2 = 'backup/';

    $contenido = file_get_contents($_FILES['jsonBlob']['tmp_name']);
    $nombreArchivo = $ruta . date('Ymd_His') . '.json';
    $nombreArchivo2 = $ruta2 . date('Ymd_His') . '.json';
    // Escribe los datos en el archivo
    file_put_contents($nombreArchivo, $contenido);
    file_put_contents($nombreArchivo2, $contenido);

    echo json_encode("archivo  $nombreArchivo creado");
    echo json_encode("archivo  $nombreArchivo2 creado");
} else {
    echo json_encode('No se recibió ningún archivo JSON.');
}
?>
