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
import { columnsProveedores } from "../../components/data/DataColumns";

const statusColorMap = {
  activado: "success",
  Desactivado: "danger",
};

export default function ConsulProveedor() {
  const [cargando, setCargando] = useState(true);
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProveedores = async () => {
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
        if (!data.proveedores || !Array.isArray(data.proveedores)) {
          throw new Error("Received data is not correctly formatted");
        }

        const proveedoresWithStatus = data.proveedores.map((proveedor) => ({
          ...proveedor,
          estado_proveedor:
            proveedor.estado_proveedor === "1" ? "activado" : "Desactivado",
        }));
        setProveedores(proveedoresWithStatus);
      } catch (error) {
        console.error("Error fetching proveedores:", error);
        setError("Error al cargar los datos. Inténtelo de nuevo más tarde.");
      }
      setCargando(false);
    };

    fetchProveedores();
  }, []);

  const handleToggleStatus = (id) => {
    setProveedores((prevProveedores) =>
      prevProveedores.map((proveedor) =>
        proveedor.id === id
          ? {
              ...proveedor,
              estado_proveedor:
                proveedor.estado_proveedor === "Desactivado"
                  ? "activado"
                  : "Desactivado",
            }
          : proveedor
      )
    );
  };

  const renderCell = React.useCallback((proveedor, columnKey) => {
    const cellValue = proveedor[columnKey];

    switch (columnKey) {
      case "nombre_proveedor":
        return cellValue;
      case "telefono_proveedor":
        return cellValue;
      case "ciudad_proveedor":
        return cellValue;
      case "estado_proveedor":
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
            <Tooltip color="warning" content="Edit provider">
              <span className="text-lg text-warning cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete provider">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
            <Switch
              isSelected={proveedor.estado_proveedor === "Desactivado"}
              onChange={() => handleToggleStatus(proveedor.id)}
              color={
                proveedor.estado_proveedor === "Desactivado"
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
        <Table aria-label="Table with provider data" className="w-auto mx-10">
          <TableHeader columns={columnsProveedores}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={proveedores}>
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
