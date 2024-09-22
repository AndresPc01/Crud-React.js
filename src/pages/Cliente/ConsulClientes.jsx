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
import { columnsClient } from "../../components/data/DataColumns";

const statusColorMap = {
  activado: "success",
  Desactivado: "danger",
};

export default function ConsulCliente() {
  const [cargando, setCargando] = useState(true);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
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
        if (!data.clients || !Array.isArray(data.clients)) {
          throw new Error("Received data is not correctly formatted");
        }

        const clientsWithStatus = data.clients.map((client) => ({
          ...client,
          estado_cliente:
            client.estado_cliente === "1" ? "activado" : "Desactivado",
        }));
        setClients(clientsWithStatus);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setError("Error al cargar los datos. Inténtelo de nuevo más tarde.");
      }
      setCargando(false);
    };

    fetchClients();
  }, []);

  const handleToggleStatus = (id) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === id
          ? {
              ...client,
              estado_cliente:
                client.estado_cliente === "Desactivado"
                  ? "activado"
                  : "Desactivado",
            }
          : client
      )
    );
  };

  const renderCell = React.useCallback((client, columnKey) => {
    const cellValue = client[columnKey];

    switch (columnKey) {
      case "name":
        return cellValue;
      case "telefono":
        return cellValue;
      case "direccion":
        return cellValue;
      case "estado_cliente":
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
            <Tooltip color="warning" content="Edit client">
              <span className="text-lg text-warning cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete client">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
            <Switch
              isSelected={client.estado_cliente === "Desactivado"}
              onChange={() => handleToggleStatus(client.id)}
              color={
                client.estado_cliente === "Desactivado" ? "danger" : "success"
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
        <Table aria-label="Table with client data" className="w-auto mx-10">
          <TableHeader columns={columnsClient}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={clients}>
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
