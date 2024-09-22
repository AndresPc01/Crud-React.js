<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include './conexion.php';
header("Access-Control-Allow-Origin: *");
    if (isset($_POST['username']) && isset($_POST['contraseña'])) {
        $usuario = $_POST['username'];
        $contraseña = $_POST['contraseña'];
        $hash_contraseña = md5($contraseña);
    
        $sql = mysqli_query ($mysqli,"SELECT `usuario`, `contrasena`, `nombre` FROM `usuario` WHERE `usuario` = '$usuario' AND `contrasena` = '$hash_contraseña'");
        $row = mysqli_num_rows($sql);
        if ($row > 0) {  
            echo "success";
        }else{
            echo "error";
        }     
    }

    $mysqli->close();


?>