<?php
// poner este json en xampp en la ruta htdocs
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
if (isset($_FILES['file'])) {

    $ruta = 'C:\Users\user\OneDrive\Desktop\CLIENTE\TEMA7\TAREA 7\Ruiz_Montero_Ines_DWEC07_Tarea7\backup/';
    $ruta2 = 'backup/';

    $contenido = file_get_contents($_FILES['file']['tmp_name']);
    $nombreArchivo = $ruta . date('Ymd_His') . '.json';

    // Escribe los datos en el archivo
    file_put_contents($nombreArchivo, $contenido);


    echo json_encode("archivo  $nombreArchivo creado");

} else {
    echo json_encode('No se recibió ningún archivo JSON.');
}
?>