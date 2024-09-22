<?php 
$localserver = "localhost";
$usuario = "root";
$contraseña = "";
$db = "app";

$mysqli = mysqli_connect($localserver,$usuario,$contraseña,$db); 
if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}
?>