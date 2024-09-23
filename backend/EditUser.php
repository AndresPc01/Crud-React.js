<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include './conexion.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); 
header('Access-Control-Allow-Headers: Content-Type');

function actualizarUsuario($mysqli) {
    if (isset($_POST['username'], $_POST['name'], $_POST['idusuario'])) {
        $idusuario = $_POST['idusuario'];
        $usuario = $_POST['username'];
        $nombre = $_POST['name'];

        $stmt = $mysqli->prepare("UPDATE `usuario` SET `usuario`=?, `nombre`=? WHERE `idusuario`=?");
        $stmt->bind_param("ssi", $usuario, $nombre, $idusuario);
        $sql = $stmt->execute();

        return $sql ? "success" : mysqli_error($mysqli); 
    } else {
        return "missing_parameters"; 
    }
}

function eliminarUsuario($mysqli){
    if (isset($_POST['idusuario'])) {
        $idusuario = $_POST['idusuario'];
        $stmt = $mysqli->prepare("DELETE FROM `usuario` WHERE `idusuario`=?");
        $stmt->bind_param("i", $idusuario);
        $sql = $stmt->execute();

        return $sql ? "success" : mysqli_error($mysqli);  
    } else {
        return "missing_parameters"; 
    }
}

function actualizarCliente($mysqli) {
    if (isset($_POST['idcliente'], $_POST['identidad'], $_POST['name'], $_POST['telefono'], $_POST['direccion'])) {
        $idcliente = $_POST['idcliente'];
        $identidad = $_POST['identidad'];
        $name = $_POST['name'];
        $telefono = $_POST['telefono'];
        $direccion = $_POST['direccion'];

        $stmt = $mysqli->prepare("UPDATE `cliente` SET `identidad`=?, `nombre`=?, `telefono`=?, `direccion`=? WHERE `idcliente`=?");
        $stmt->bind_param("ssssi", $identidad, $name, $telefono, $direccion, $idcliente);
        $sql = $stmt->execute();

        return $sql ? "success" : mysqli_error($mysqli); 
    } else {
        return "missing_parameters";  
    }
}

function eliminarCliente($mysqli){
    if (isset($_POST['idcliente'])) {
        $idcliente = $_POST['idcliente'];
        $stmt = $mysqli->prepare("DELETE FROM `cliente` WHERE `idcliente`=?");
        $stmt->bind_param("i", $idcliente);
        $sql = $stmt->execute();

        return $sql ? "success" : mysqli_error($mysqli);  
    } else {
        return "missing_parameters"; 
    }
}


function actualizarProveedor($mysqli) {
    if (isset($_POST['idproveedor'], $_POST['nombre_proveedor'], $_POST['telefono_proveedor'], $_POST['ciudad_proveedor'])) {
        $idproveedor = $_POST['idproveedor'];
        $nombre_proveedor = $_POST['nombre_proveedor'];
        $telefono_proveedor = $_POST['telefono_proveedor'];
        $ciudad_proveedor = $_POST['ciudad_proveedor'];

        $stmt = $mysqli->prepare("UPDATE `proveedor` SET `nombre_proveedor`=?, `telefono_proveedor`=?, `ciudad_proveedor`=? WHERE `idproveedor`=?");
        $stmt->bind_param("sssi", $nombre_proveedor, $telefono_proveedor, $ciudad_proveedor, $idproveedor);
        $sql = $stmt->execute();

        return $sql ? "success" : mysqli_error($mysqli); 
    } else {
        return "missing_parameters";  
    }
}


function eliminarProveedor($mysqli) {
    if (isset($_POST['idproveedor'])) {
        $idproveedor = $_POST['idproveedor'];
        $stmt = $mysqli->prepare("DELETE FROM `proveedor` WHERE `idproveedor`=?");
        $stmt->bind_param("i", $idproveedor);
        $sql = $stmt->execute();

        return $sql ? "success" : mysqli_error($mysqli);  
    } else {
        return "missing_parameters"; 
    }
}



function actualizarProducto($mysqli) {
    if (isset($_POST['idproducto'], $_POST['nombre_producto'], $_POST['cantidad'], $_POST['precio_unidad'])) {
        $idproducto = $_POST['idproducto'];
        $nombre_producto = $_POST['nombre_producto'];
        $cantidad = $_POST['cantidad'];
        $precio_unidad = $_POST['precio_unidad'];

        $stmt = $mysqli->prepare("UPDATE `producto` SET `nombre_producto`=?, `cantidad`=?, `precio_unidad`=? WHERE `idproducto`=?");
        $stmt->bind_param("siii", $nombre_producto, $cantidad, $precio_unidad, $idproducto);
        $sql = $stmt->execute();

        return $sql ? "success" : mysqli_error($mysqli); 
    } else {
        return "missing_parameters";  
    }
}

function eliminarProducto($mysqli) {
    if (isset($_POST['idproducto'])) {
        $idproducto = $_POST['idproducto'];
        $stmt = $mysqli->prepare("DELETE FROM `producto` WHERE `idproducto`=?");
        $stmt->bind_param("i", $idproducto);
        $sql = $stmt->execute();

        return $sql ? "success" : mysqli_error($mysqli);  
    } else {
        return "missing_parameters"; 
    }
}


$response = [];

if (isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'actualizar':
            $response['result'] = actualizarUsuario($mysqli);
            break;
        case 'eliminar':
            $response['result'] = eliminarUsuario($mysqli);
            break;
        case 'actualizarcliente':
            $response['result'] = actualizarCliente($mysqli);
            break;
            case 'eliminarcliente':
                $response['result'] = eliminarCliente($mysqli);
                break;
                case 'actualizarproveedor':
                    $response['result'] = actualizarProveedor($mysqli);
                    break;
                    case 'eliminarproveedor':
                        $response['result'] = eliminarProveedor($mysqli);
                        break;
                        case 'actualizarproducto':
                            $response['result'] = actualizarProducto($mysqli);
                            break;
                        case 'eliminarproducto':
                            $response['result'] = eliminarProducto($mysqli);
                            break;
        default:
            $response['result'] = "invalid_action";
    }
} else {
    $response['result'] = "no_action_specified";
}

echo json_encode($response);
$mysqli->close();
?>