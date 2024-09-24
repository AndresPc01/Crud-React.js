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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { EditIcon } from "../../components/icons/EditIcon";
import { DeleteIcon } from "../../components/icons/DeleteIcon";
import { columnsProveedores } from "../../components/data/DataColumns";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const statusColorMap = {
  activado: "success",
  Desactivado: "danger",
};

export default function ConsulProveedor() {
  const [cargando, setCargando] = useState(true);
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState(null);
  const [datuser, setDataUser] = useState(null);
  const [edituser, setEditUser] = useState(null);
  const [name, setName] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");

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

  useEffect(() => {
    fetchProveedores();
    const intervalId = setInterval(() => {
      fetchProveedores();
    }, 10000);

    return () => clearInterval(intervalId);
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

  const handleUserDelete = (proveedor) => {
    setDataUser(proveedor.id);
    openDeleteModal();
  };

  const handleUserEdit = (proveedor) => {
    setEditUser(proveedor);
    setName(proveedor.nombre_proveedor);
    setTelefono(proveedor.telefono_proveedor);
    setCiudad(proveedor.ciudad_proveedor);
    openLoginModal();
    openLoginModal();
  };

  const SendEditProveedor = (id) => {
    const URL = "http://localhost/Proyectos/app-curd/backend/EditUser.php";
    let fData = new FormData();
    fData.append("action", "actualizarproveedor");
    fData.append("idproveedor", id);
    fData.append("nombre_proveedor", name);
    fData.append("telefono_proveedor", telefono);
    fData.append("ciudad_proveedor", ciudad);
    axios
      .post(URL, fData)
      .then((response) => {
        if (response.data.result === "success") {
          toast.success("Cambios Guardados");
          fetchProveedores();
        } else {
          toast.error("Error: " + response.data.message);
        }
      })
      .catch((error) => setError("Error: " + error.message));
  };

  const sendDeleteProveedor = (id) => {
    const URL = "http://localhost/Proyectos/app-curd/backend/EditUser.php";
    let fData = new FormData();
    fData.append("action", "eliminarproveedor");
    fData.append("idproveedor", id);

    axios
      .post(URL, fData)
      .then((response) => {
        if (response.data.result === "success") {
          toast.success("Eliminado con Éxito");
          fetchProveedores();
        } else {
          toast.error("Error");
        }
      })
      .catch((error) => setError("Error: " + error.message));
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
              <span
                onClick={() => handleUserEdit(proveedor)}
                className="text-lg text-warning cursor-pointer active:opacitErrory-50"
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete provider">
              <span
                onClick={() => handleUserDelete(proveedor)}
                className="text-lg text-danger cursor-pointer active:opacity-50"
              >
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
      <ToastContainer className={"absolute z-10 right-0 top-0"} />
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
                    label="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="bordered"
                  />
                  <Input
                    label="Telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    variant="bordered"
                  />
                  <Input
                    label="Ciudad"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    variant="bordered"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => SendEditProveedor(edituser.id)}
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
                    onClick={() => sendDeleteProveedor(datuser.id)}
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
