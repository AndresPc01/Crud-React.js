<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); 
header('Access-Control-Allow-Headers: Content-Type'); 

include './conexion.php';

function getUsers($mysqli) {
    $sql = mysqli_query($mysqli, "SELECT 
        u.idusuario, 
        u.usuario, 
        u.contrasena, 
        u.nombre, 
        u.estado, 
        p.nombre_perfil 
    FROM 
        usuario u 
    JOIN 
        perfil p ON u.idperfilfk = p.IDPerfil
    ");

    $users = [];

    if ($sql) {
        while ($row = mysqli_fetch_assoc($sql)) {
            $users[] = [
                'id' => $row['idusuario'],
                'email' => $row['usuario'],
                'name' => $row['nombre'],
                'status' => $row['estado'],
                'role' => $row['nombre_perfil']
            ];
        }
        return $users;
    } else {
        return ['error' => 'Error en la consulta de usuarios: ' . mysqli_error($mysqli)];
    }
}

function getClients($mysqli) {
    $sql = mysqli_query($mysqli, "SELECT 
        c.idcliente, 
        c.identidad, 
        c.nombre, 
        c.telefono, 
        c.direccion,
        c.estado_cliente
    FROM 
        cliente c
    ");

    $clients = [];

    if ($sql) {
        while ($row = mysqli_fetch_assoc($sql)) {
            $clients[] = [
                'id' => $row['idcliente'],
                'identidad' => $row['identidad'],
                'name' => $row['nombre'],
                'telefono' => $row['telefono'],
                'direccion' => $row['direccion'],
                'estado_cliente' => $row['estado_cliente']
            ];
        }
        return $clients;
    } else {
        return ['error' => 'Error en la consulta de clientes: ' . mysqli_error($mysqli)];
    }
}

function getProveedores($mysqli) {
    $sql = mysqli_query($mysqli, "SELECT 
        p.idproveedor, 
        p.nombre_proveedor, 
        p.telefono_proveedor, 
        p.ciudad_proveedor, 
        p.estado_proveedor
    FROM 
        proveedor p");

    $Proveedores = [];

    if ($sql) {
        while ($row = mysqli_fetch_assoc($sql)) {
            $Proveedores[] = [
                'id' => $row['idproveedor'],
                'nombre_proveedor' => $row['nombre_proveedor'],
                'telefono_proveedor' => $row['telefono_proveedor'],
                'ciudad_proveedor' => $row['ciudad_proveedor'],
                'estado_proveedor' => $row['estado_proveedor']
   
            ];
        }
        return $Proveedores;
    } else {
        return ['error' => 'Error en la consulta de Proveedores: ' . mysqli_error($mysqli)];
    }
}

function getProductos($mysqli) {
    $sql = mysqli_query($mysqli, "SELECT 
        p.idproducto, 
        p.nombre_producto, 
        p.cantidad, 
        p.precio_unidad, 
        p.idproveedorfk,
        p.estado_producto,
        pr.nombre_proveedor
    FROM 
        producto p
    JOIN 
        proveedor pr ON p.idproveedorfk = pr.idproveedor
        ");

    $Productos = [];

    if ($sql) {
        while ($row = mysqli_fetch_assoc($sql)) {
            $Productos[] = [
                'id' => $row['idproducto'],
                'nombre_producto' => $row['nombre_producto'],
                'cantidad' => $row['cantidad'],
                'precio_unidad' => $row['precio_unidad'],
                'nombre_proveedor' => $row['nombre_proveedor'],
                'estado_producto' => $row['estado_producto']
   
            ];
        }
        return $Productos;
    } else {
        return ['error' => 'Error en la consulta de Productos: ' . mysqli_error($mysqli)];
    }
}


$response = [
    'users' => getUsers($mysqli),
    'clients' => getClients($mysqli),
    'proveedores' => getProveedores($mysqli),
    'productos' => getProductos($mysqli),
];

echo json_encode($response);

mysqli_close($mysqli);
?>