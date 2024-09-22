import React, { useEffect, useState } from "react";
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
} from "@nextui-org/react";
import { EditIcon } from "../../components/icons/EditIcon";
import { DeleteIcon } from "../../components/icons/DeleteIcon";
import { EyeIcon } from "../../components/icons/EyeIcon";
import { columnsUser } from "../../components/data/DataColumns";

const statusColorMap = {
  activado: "success",
  Desactivado: "danger",
};

const ConfirmEliminacion = () => {};

export default function ConsulUsuario() {
  const [cargando, setCargando] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [abierto, setAbierto] = useState(false);

  const confirmModal = () => {
    setAbierto(!abierto);
  };

  const valorestado = abierto;
  console.log(abierto);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

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
        setError("Error al cargar los datos. Inténtelo de nuevo más tarde.");
      }
      setCargando(false);
    };

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

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
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
            <Tooltip color="foreground" content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip color="warning" content="Edit user">
              <span
                onClick={ConfirmEliminacion}
                className="text-lg text-warning cursor-pointer active:opacity-50"
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon onClick={confirmModal} />
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
    <div className="flex justify-center items-center w-full mt-10 ">
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
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem
                  eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>{" "}
    </div>
  );
}
