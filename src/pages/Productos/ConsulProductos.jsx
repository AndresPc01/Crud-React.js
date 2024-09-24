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
import { columnsProductos } from "../../components/data/DataColumns";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

const statusColorMap = {
  activado: "success",
  Desactivado: "danger",
};

export default function ConsulProductos() {
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
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [datuser, setDataUser] = useState(null);
  const [edituser, setEditUser] = useState(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");

  const fetchProductos = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch(
        "http://localhost/Proyectos/app-curd/backend/GetDataTable.php"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

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
      setError(
        "Error al cargar los datos. Inténtelo de nuevo más tarde." + error
      );
    }
    setCargando(false);
  };
  useEffect(() => {
    fetchProductos();
    const intervalId = setInterval(() => {
      fetchProductos();
    }, 10000);

    return () => clearInterval(intervalId);
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

  const handleUserDelete = (producto) => {
    setDataUser(producto);
    openDeleteModal();
  };

  const handleUserEdit = (producto) => {
    setEditUser(producto);
    setUsername(producto.nombre_producto);
    setName(producto.nombre_proveedor);
    setCantidad(producto.cantidad);
    setPrecio(producto.precio_unidad);
    openLoginModal();
  };

  const SendEditUser = (id) => {
    const URL = "http://localhost/Proyectos/app-curd/backend/EditUser.php";
    let fData = new FormData();
    fData.append("action", "actualizarproducto");
    fData.append("idproducto", id);
    fData.append("nombre_producto", username);
    fData.append("cantidad", cantidad);
    fData.append("precio_unidad", precio);

    axios
      .post(URL, fData)
      .then((response) => {
        console.log(response.data);
        if (response.data.result === "success") {
          toast.success("Cambios Guardados");
          fetchProductos();
        } else {
          toast.error("Error al guardar cambios");
        }
      })
      .catch((error) => {
        setError("Error al realizar la edición." + error);
      });
  };

  const sendDeleteUser = (id) => {
    const URL = "http://localhost/Proyectos/app-curd/backend/EditUser.php";
    let fData = new FormData();
    fData.append("action", "eliminarproducto");
    fData.append("idproducto", id);

    axios
      .post(URL, fData)
      .then((response) => {
        if (response.data.result === "success") {
          toast.success("Eliminado con Éxito");
          fetchProductos();
        } else {
          toast.error("Error al eliminar el producto");
        }
      })
      .catch((error) => {
        console.error("Error al eliminar el producto:", error);
        setError("Error al realizar la eliminación.");
      });
  };

  const renderCell = (producto, columnKey) => {
    const cellValue = producto[columnKey];
    switch (columnKey) {
      case "nombre_producto":
      case "cantidad":
      case "precio_unidad":
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
              <span
                onClick={() => handleUserEdit(producto)}
                className="text-lg text-warning cursor-pointer active:opacity-50"
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete product">
              <span
                onClick={() => handleUserDelete(producto)}
                className="text-lg text-danger cursor-pointer active:opacity-50"
              >
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
    <div className="flex justify-center items-center w-full mt-10">
      <ToastContainer className={"absolute z-10 right-0 top-0"} />
      <div className="overflow-auto w-full" style={{ minWidth: "600px" }}>
        <Table aria-label="Table with product data" className="w-auto mx-10">
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
                  Editar Producto
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="Nombre del Producto"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    variant="bordered"
                  />
                  <Input
                    label="Cantidad"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    variant="bordered"
                  />

                  <Input
                    label="Precio unidad"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    variant="bordered"
                  />
                  <Input
                    label="Nombre Proveedor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="bordered"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      SendEditUser(edituser.id);
                      onClose();
                    }}
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
                <ModalHeader className="flex text-center flex-col gap-1">
                  Confirmar Eliminación
                </ModalHeader>
                <ModalBody className="flex flex-col items-center gap-2">
                  ¿Está seguro de que desea eliminar el producto{" "}
                  <span className="font-bold">{datuser.nombre_producto}</span>?
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      sendDeleteUser(datuser.id);
                      onClose();
                    }}
                  >
                    Eliminar
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
