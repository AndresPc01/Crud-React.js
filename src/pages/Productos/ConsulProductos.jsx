import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Switch,
  CircularProgress,
} from "@nextui-org/react";
import { EditIcon } from "../../components/icons/EditIcon";
import { DeleteIcon } from "../../components/icons/DeleteIcon";
import { columnsProductos } from "../../components/data/DataColumns";

const statusColorMap = {
  activado: "success",
  Desactivado: "danger",
};

export default function ConsulProductos() {
  const [cargando, setCargando] = useState(true);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Simula tiempo de carga, eliminar en producción
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await fetch(
          "http://localhost/Proyectos/app-curd/backend/GetDataTable.php"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Verifica y transforma los datos
        if (!data.productos || !Array.isArray(data.productos)) {
          throw new Error("Received data is not correctly formatted");
        }

        const productosWithStatus = data.productos.map((producto) => ({
          ...producto,
          estado_producto:
            producto.estado_producto === "1" ? "activado" : "Desactivado",
        }));
        setProductos(productosWithStatus);
      } catch (error) {
        console.error("Error fetching productos:", error);
        setError("Error al cargar los datos. Inténtelo de nuevo más tarde.");
      }
      setCargando(false);
    };

    fetchProductos();
  }, []);

  const handleToggleStatus = (id) => {
    setProductos((prevProductos) =>
      prevProductos.map((producto) =>
        producto.id === id
          ? {
              ...producto,
              estado_producto:
                producto.estado_producto === "Desactivado"
                  ? "activado"
                  : "Desactivado",
            }
          : producto
      )
    );
  };

  const renderCell = React.useCallback((producto, columnKey) => {
    const cellValue = producto[columnKey];

    switch (columnKey) {
      case "nombre_producto":
        return cellValue;
      case "cantidad":
        return cellValue;
      case "precio_unidad":
        return cellValue;
      case "nombre_proveedor":
        return cellValue;
      case "estado_producto":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[cellValue]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-between items-center gap-2">
            <Tooltip color="warning" content="Edit product">
              <span className="text-lg text-warning cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete product">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
            <Switch
              isSelected={producto.estado_producto === "Desactivado"}
              onChange={() => handleToggleStatus(producto.id)}
              color={
                producto.estado_producto === "Desactivado"
                  ? "danger"
                  : "success"
              }
              size="sm"
            />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  if (cargando) {
    return (
      <div className="flex w-full mt-10 justify-center items-center">
        <CircularProgress label="Cargando Contenido de Tabla" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full mt-10 justify-center items-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full mt-10">
      <div className="overflow-auto w-full" style={{ minWidth: "600px" }}>
        <Table aria-label="Table with product data" className="  w-auto mx-10">
          <TableHeader columns={columnsProductos}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={productos}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
