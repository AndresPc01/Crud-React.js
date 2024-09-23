const columnsUser = [
    {name: "NAME", uid: "name"},
    {name: "ROLE", uid: "role"},
    {name: "EMAIL", uid: "email"},
    {name: "STATUS", uid: "status"},
    {name: "ACTIONS", uid: "actions"},
  ];
  const columnsClient = [
    { name: "IDENTIDAD", uid: "identidad" },
    { name: "NAME", uid: "name" },
    { name: "TELEFONO", uid: "telefono" },
    { name: "DIRECCION", uid: "direccion" },
    { name: "ESTADO CLIENTE", uid: "estado_cliente" },
    { name: "ACTIONS", uid: "actions" },
];
const columnsProveedores = [
  { name: "nombre_proveedor", uid: "nombre_proveedor" },
  { name: "telefono_proveedor", uid: "telefono_proveedor" },
  { name: "ciudad_proveedor", uid: "ciudad_proveedor" },
  { name: "estado_proveedor", uid: "estado_proveedor" },
  { name: "ACTIONS", uid: "actions" },
];
const columnsProductos = [
  { name: "nombre_producto", uid: "nombre_producto" },
  { name: "cantidad", uid: "cantidad" },
  { name: "precio_unidad", uid: "precio_unidad" },
  { name: "nombre_proveedor", uid: "nombre_proveedor" },
  { name: "estado_producto", uid: "estado_producto" },
  { name: "ACTIONS", uid: "actions" },
];
const columnsVentas = [
  { name: "nombre_cliente", uid: "nombre_cliente" },
  { name: "cantidad", uid: "cantidad" },
  { name: "nombre_producto", uid: "nombre_producto" },
  { name: "subtotal", uid: "subtotal" },
  { name: "iva", uid: "iva" },
  { name: "total", uid: "total" },
  { name: "ACTIONS", uid: "actions" },
];
export { columnsUser, columnsClient, columnsProveedores, columnsProductos, columnsVentas, };

