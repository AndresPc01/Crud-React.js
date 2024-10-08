<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); 
header('Access-Control-Allow-Headers: Content-Type'); 

include './conexion.php';

function getperfiles($mysqli) {
    $sql = mysqli_query($mysqli, "SELECT 
        p.IDPerfil,
        p.nombre_perfil
    FROM 
        perfil p 
    ");

    $perfil = [];

    if ($sql) {
        while ($row = mysqli_fetch_assoc($sql)) {
            $perfil[] = [
                'id' => $row['IDPerfil'],
                'nombre_perfil' => $row['nombre_perfil'],

            ];
        }
        return $perfil;
    } else {
        return ['error' => 'Error en la consulta de usuarios: ' . mysqli_error($mysqli)];
    }
}

function getcliente($mysqli) {
    $sql = mysqli_query($mysqli, "SELECT 
        c.idcliente,
        c.nombre
    FROM 
        cliente c 
    ");

    $cliente = [];

    if ($sql) {
        while ($row = mysqli_fetch_assoc($sql)) {
            $cliente[] = [
                'id' => $row['idcliente'],
                'nombre' => $row['nombre'],

            ];
        }
        return $cliente;
    } else {
        return ['error' => 'Error en la consulta de usuarios: ' . mysqli_error($mysqli)];
    }
}


function getproducto($mysqli) {
    $sql = mysqli_query($mysqli, "SELECT 
        p.idproducto,
        p.nombre_producto
    FROM 
        producto p 
    ");

    $cliente = [];

    if ($sql) {
        while ($row = mysqli_fetch_assoc($sql)) {
            $cliente[] = [
                'id' => $row['idproducto'],
                'nombre' => $row['nombre_producto'],

            ];
        }
        return $cliente;
    } else {
        return ['error' => 'Error en la consulta de usuarios: ' . mysqli_error($mysqli)];
    }
}


function getproveedores($mysqli) {
    $sql = mysqli_query($mysqli, "SELECT 
        p.idproveedor,
        p.nombre_proveedor
    FROM 
        proveedor p 
    ");

    $proveedor = [];

    if ($sql) {
        while ($row = mysqli_fetch_assoc($sql)) {
            $proveedor[] = [
                'id' => $row['idproveedor'],
                'nombre_proveedor' => $row['nombre_proveedor'],

            ];
        }
        return $proveedor;
    } else {
        return ['error' => 'Error en la consulta  de  proveedores: ' . mysqli_error($mysqli)];
    }
}

function sendUsuario($mysqli) {
    if (isset($_POST['usuario'], $_POST['contraseña'], $_POST['nombre'], $_POST['email'], $_POST['idestado'], $_POST['idperfil'])) {
        $usuario = $_POST['usuario'];
        $hash_contraseña = md5($_POST['contraseña']);
        $nombre = $_POST['nombre'];
        $email = $_POST['email'];
        $idestado = (int)$_POST['idestado'];
        $idperfil = (int)$_POST['idperfil'];

        $stmt = $mysqli->prepare("INSERT INTO `usuario` (`usuario`, `contrasena`, `nombre`, `email`, `estado`, `idperfilfk`) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssii", $usuario, $hash_contraseña, $nombre, $email, $idestado, $idperfil);

        if ($stmt->execute()) {
            return ['result' => 'success'];
        } else {
            return ['error' => 'Error al registrar usuario: ' . mysqli_error($mysqli)];
        }
    } else {
        return ['error' => 'Faltan datos requeridos.'];
    }
}

function sendCliente($mysqli) {

    if (isset($_POST['identidad'], $_POST['nombre'], $_POST['telefono'], $_POST['direccion'], $_POST['idestado_cliente'])) {
        $identidad = $_POST['identidad'];
        $nombre = $_POST['nombre'];
        $telefono = $_POST['telefono'];
        $direccion = $_POST['direccion'];
        $idestado_cliente = (int)$_POST['idestado_cliente'];

        $stmt = $mysqli->prepare("INSERT INTO `cliente`(`identidad`, `nombre`, `telefono`, `direccion`, `estado_cliente`) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("isisi", $identidad, $nombre, $telefono, $direccion, $idestado_cliente);

        if ($stmt->execute()) {
            return ['result' => 'success'];
        } else {
            return ['error' => 'Error al registrar cliente: ' . mysqli_error($mysqli)];
        }
    } else {
        return ['error' => 'Faltan datos requeridos.'];
    }
}

function sendProveedor($mysqli) {

    if (isset($_POST['nombre_proveedor'], $_POST['telefono_proveedor'], $_POST['ciudad_proveedor'], $_POST['estado_proveedor'])) {
        $nombre_proveedor = $_POST['nombre_proveedor'];
        $telefono_proveedor = (int)$_POST['telefono_proveedor'];
        $ciudad_proveedor = $_POST['ciudad_proveedor'];
        $estado_proveedor = (int)$_POST['estado_proveedor'];


        $stmt = $mysqli->prepare("INSERT INTO `proveedor`(`nombre_proveedor`, `telefono_proveedor`, `ciudad_proveedor`, `estado_proveedor`) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sisi", $nombre_proveedor, $telefono_proveedor, $ciudad_proveedor, $estado_proveedor);

        if ($stmt->execute()) {
            return ['result' => 'success'];
        } else {
            return ['error' => 'Error al registrar proveedor: ' . mysqli_error($mysqli)];
        }
    } else {
        return ['error' => 'Faltan datos requeridos.'];
    }
}



function sendProducto($mysqli) {

    if (isset($_POST['nombre'], $_POST['precio'], $_POST['cantidad'], $_POST['idestado'], $_POST['idproveedor'])) {
        $nombre_producto = $_POST['nombre'];
        $precio_unidad = (int)$_POST['precio'];
        $cantidad = (int)$_POST['cantidad'];
        $idproveedorfk = (int)$_POST['idproveedor'];
        $estado_producto = (int)$_POST['idestado'];

        $stmt = $mysqli->prepare("INSERT INTO `producto`(`nombre_producto`, `cantidad`, `precio_unidad`, `idproveedorfk`, `estado_producto`) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("siiii", $nombre_producto, $cantidad, $precio_unidad, $idproveedorfk, $estado_producto);

        if ($stmt->execute()) {
            return ['result' => 'success'];
        } else {
            return ['error' => 'Error al registrar producto: ' . mysqli_error($mysqli)];
        }
    } else {
        return ['error' => 'Faltan datos requeridos.'];
    }
}

function sendVenta($mysqli) {
    if (isset($_POST['idperfil'], $_POST['cantidad'], $_POST['producto'])) {
        $idperfil = (int)$_POST['idperfil'];
        $cantidad = (int)$_POST['cantidad'];
        $producto = (int)$_POST['producto'];

        $stmt = $mysqli->prepare("INSERT INTO `ventas`(`idclientefk`, `idproductofk`, `cantidad`) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $idperfil, $producto, $cantidad);
        
        
        if ($stmt->execute()) {
            $stpt = $mysqli->prepare("UPDATE producto SET cantidad = cantidad - ? WHERE idproducto = ?");
            $stpt->bind_param("ii", $cantidad, $producto);
            $stpt->execute(); 

            return ['result' => 'success'];
        } else {
            return ['error' => 'Error al registrar venta: ' . $mysqli->error];
        }
    } else {
        return ['error' => 'Faltan datos requeridos.'];
    }
}




$response = [
    'cliente' => getcliente($mysqli),
    'perfil' => getperfiles($mysqli),
    'producto' => getproducto($mysqli),
    'proveedores' => getproveedores($mysqli),
    'sendUsuario' => sendUsuario($mysqli), 
    'sendCliente' => sendCliente($mysqli), 
    'sendProveedor' => sendProveedor($mysqli),
    'sendProducto' => sendProducto($mysqli),
    'sendVenta' => sendVenta($mysqli),  

];

echo json_encode($response);

mysqli_close($mysqli);
?>