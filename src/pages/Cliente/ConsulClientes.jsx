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
  ModalContent,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { EditIcon } from "../../components/icons/EditIcon";
import { DeleteIcon } from "../../components/icons/DeleteIcon";
import { columnsClient } from "../../components/data/DataColumns";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
const statusColorMap = {
  activado: "success",
  Desactivado: "danger",
};

export default function ConsulCliente() {
  const [cargando, setCargando] = useState(true);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [datuser, setDataUser] = useState(null);
  const [edituser, setEditUser] = useState(null);
  const [identidad, setIdentidad] = useState("");
  const [name, setName] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const {
    isOpen: isLoginModalOpen,
    onOpen: openLoginModal,
    onOpenChange: onLoginModalChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onOpenChange: onDeleteModalChange,
  } = useDisclosure();

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

  useEffect(() => {
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

  const handleUserDelete = (client) => {
    setDataUser(client);
    openDeleteModal();
  };

  const handleUserEdit = (client) => {
    setEditUser(client);
    setIdentidad(client.identidad); // Inicializa el estado
    setName(client.name); // Inicializa el estado
    setTelefono(client.telefono); // Inicializa el estado
    setDireccion(client.direccion); // Inicializa el estado
    openLoginModal();
  };

  const SendEditUser = (id) => {
    const URL = "http://localhost/Proyectos/app-curd/backend/EditUser.php";
    let fData = new FormData();
    fData.append("action", "actualizarcliente");
    fData.append("idcliente", id);
    fData.append("identidad", identidad);
    fData.append("name", name);
    fData.append("telefono", telefono);
    fData.append("direccion", direccion);
    axios
      .post(URL, fData)
      .then((response) => {
        if (response.data.result === "success") {
          toast.success("Cambios Guardados");
          fetchClients();
        } else {
          toast.error("Error");
        }
      })
      .catch((error) => setError(error));
  };

  const sendDeleteUser = (id) => {
    const URL = "http://localhost/Proyectos/app-curd/backend/EditUser.php";
    let fData = new FormData();
    fData.append("action", "eliminarcliente"); // Añadir acción
    fData.append("idcliente", id);

    axios
      .post(URL, fData)
      .then((response) => {
        if (response.data.result === "success") {
          toast.success("Eliminado con Éxito");
          fetchClients();
        } else {
          toast.error("Error");
        }
      })
      .catch((error) => setError(error));
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
              <span
                onClick={() => handleUserEdit(client)}
                className="text-lg text-warning cursor-pointer active:opacity-50"
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete client">
              <span
                onClick={() => handleUserDelete(client)}
                className="text-lg text-danger cursor-pointer active:opacity-50"
              >
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
      <ToastContainer className={"absolute z-10 right-0 top-0"} />
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
      {edituser && (
        <Modal
          isOpen={isLoginModalOpen}
          onOpenChange={onLoginModalChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-center">
                  Editar Usuario
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="Identidad"
                    value={identidad}
                    onChange={(e) => setIdentidad(e.target.value)}
                    variant="bordered"
                  />
                  <Input
                    label="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="bordered"
                  />
                  <Input
                    type="number"
                    label="Telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    variant="bordered"
                  />
                  <Input
                    label="Direccion"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    variant="bordered"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => SendEditUser(edituser.id)}
                    onPress={onClose}
                  >
                    Guardar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}

      {datuser && (
        <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex text-center  flex-col gap-1">
                  Confirmar Eliminación
                </ModalHeader>
                <ModalBody>
                  <p className="flex justify-between">
                    Al confirmar, eliminarás al usuario
                    <b className="text-red-400">{datuser.name}</b>
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => sendDeleteUser(datuser.id)}
                    onPress={onClose}
                  >
                    Confirmar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
