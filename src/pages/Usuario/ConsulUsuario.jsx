import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Switch,
  CircularProgress,
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  ModalContent,
  Modal,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { EditIcon } from "../../components/icons/EditIcon";
import { DeleteIcon } from "../../components/icons/DeleteIcon";
import { columnsUser } from "../../components/data/DataColumns";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusColorMap = {
  activado: "success",
  Desactivado: "danger",
};

export default function ConsulUsuario() {
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

  const [cargando, setCargando] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [datuser, setDataUser] = useState(null);
  const [edituser, setEditUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const fetchUsers = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch(
        "http://localhost/Proyectos/app-curd/backend/GetDataTable.php"
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (!data.users || !Array.isArray(data.users)) {
        throw new Error("Received data is not correctly formatted");
      }

      const usersWithStatus = data.users.map((user) => ({
        ...user,
        status: user.status === "1" ? "activado" : "Desactivado",
      }));
      setUsers(usersWithStatus);
    } catch (error) {
      setError(
        "Error al cargar los datos. Inténtelo de nuevo más tarde" + error
      );
    }
    setCargando(false);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Desactivado" ? "activado" : "Desactivado",
            }
          : user
      )
    );
  };

  const handleUserDelete = (user) => {
    setDataUser(user);
    openDeleteModal();
  };

  const handleUserEdit = (user) => {
    setEditUser(user);
    openLoginModal();
  };
  const SendEditUser = (id) => {
    const URL = "http://localhost/Proyectos/app-curd/backend/EditUser.php";
    let fData = new FormData();
    fData.append("action", "actualizar"); // Añadir acción
    fData.append("idusuario", id);
    fData.append("username", username);
    fData.append("email", email);
    fData.append("name", name);

    axios
      .post(URL, fData)
      .then((response) => {
        if (response.data.result === "success") {
          toast.success("Cambios Guardados");
          fetchUsers();
        } else {
          toast.error("Error");
        }
      })
      .catch((error) => setError(error));
  };

  const sendDeleteUser = (id) => {
    const URL = "http://localhost/Proyectos/app-curd/backend/EditUser.php";
    let fData = new FormData();
    fData.append("action", "eliminar"); // Añadir acción
    fData.append("idusuario", id);

    axios
      .post(URL, fData)
      .then((response) => {
        if (response.data.result === "success") {
          toast.success("Eliminado con Éxito");
          fetchUsers();
        } else {
          toast.error("Error");
        }
      })
      .catch((error) => toast.error(error));
  };

  const renderCell = (user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.usuario}
            name={cellValue}
          >
            {user.usuario}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">
              {user.team}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-between items-center gap-2">
            <Tooltip color="warning" content="Edit user">
              <span
                onClick={() => handleUserEdit(user)}
                className="text-lg text-warning cursor-pointer active:opacity-80"
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span
                onClick={() => handleUserDelete(user)}
                className="text-lg text-danger cursor-pointer active:opacity-50"
              >
                <DeleteIcon />
              </span>
            </Tooltip>
            <Switch
              isSelected={user.status === "Desactivado"}
              onChange={() => handleToggleStatus(user.id)}
              color={user.status === "Desactivado" ? "danger" : "success"}
              size="sm"
            />
          </div>
        );
      default:
        return cellValue;
    }
  };

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
    <div className="flex justify-center items-center w-full mt-10 ">
      <ToastContainer className={"fixed z-10 right-0 top-0"} />
      <div className="overflow-auto w-full" style={{ minWidth: "600px" }}>
        <Table aria-label="Table with user data" className="w-auto mx-10">
          <TableHeader columns={columnsUser}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={users}>
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
                    onChange={(e) => setName(e.target.value)}
                    placeholder={edituser.name}
                    variant="bordered"
                  />
                  <Input
                    label="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={edituser.usuario}
                    variant="bordered"
                  />
                  <Input
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={edituser.email}
                    variant="bordered"
                  />
                  <Input
                    label="Rol"
                    placeholder={edituser.role}
                    variant="bordered"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    ClosesendDeleteUser
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
