<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include './conexion.php';
header("Access-Control-Allow-Origin: *");
    if (isset($_POST['nombre']) && isset($_POST['username']) && isset($_POST['contraseña'])) {
        $nombre = $_POST['nombre'];
        $usuario = $_POST['username'];
        $contraseña = $_POST['contraseña'];
        $hash_contraseña = md5($contraseña);
    
        $sql = mysqli_query($mysqli,"INSERT INTO `usuario`(`usuario`,`contrasena`, `nombre`) VALUES ('$usuario','$hash_contraseña','$nombre')"); 
        if ($sql) {  
            echo "success";
        }else{
            echo "error";
        }     
    }
    $mysqli->close();


?>