import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
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
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { columnsVentas } from "../../components/data/DataColumns";

export default function ConsulVentas() {
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
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState(null);
  const [datUser, setDataUser] = useState(null);
  const [editVenta, setEditVenta] = useState(null);
  const [idClient, setIdClient] = useState("");
  const [idProduct, setIdProduct] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [subtotal, setSubtotal] = useState("");
  const [iva, setIva] = useState("");
  const [total, setTotal] = useState("");

  const fetchVentas = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch(
        "http://localhost/Proyectos/app-curd/backend/GetDataTable.php"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      if (!data.ventas || !Array.isArray(data.ventas)) {
        throw new Error("Received data is not correctly formatted");
      }

      setVentas(data.ventas);
    } catch (error) {
      setError(
        "Error al cargar los datos. Inténtelo de nuevo más tarde." + error
      );
    }
    setCargando(false);
  };

  useEffect(() => {
    fetchVentas();
    const intervalId = setInterval(() => {
      fetchVentas();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const handleUserDelete = (venta) => {
    setDataUser(venta);
    openDeleteModal();
  };

  const handleUserEdit = (venta) => {
    setEditVenta(venta);
    setIdClient(venta.nombre_cliente);
    setIdProduct(venta.nombre_producto);
    setCantidad(venta.cantidad);
    setSubtotal(venta.subtotal);
    setIva(venta.iva);
    setTotal(venta.total);
    openLoginModal();
  };

  const sendEditVenta = (id) => {
    const URL = "http://localhost/Proyectos/app-curd/backend/EditUser.php";
    let fData = new FormData();
    fData.append("action", "actualizarventa");
    fData.append("idventa", id);
    fData.append("idclientefk", idClient);
    fData.append("idproductofk", idProduct);
    fData.append("cantidad", cantidad);
    fData.append("subtotal", subtotal);
    fData.append("iva", iva);
    fData.append("total", total);

    axios
      .post(URL, fData)
      .then((response) => {
        if (response.data.result === "success") {
          toast.success("Cambios Guardados");
          fetchVentas();
        } else {
          toast.error("Error al guardar cambios");
        }
      })
      .catch((error) => {
        setError("Error al realizar la edición." + error);
      });
  };

  const sendDeleteUser = (id, cantidad) => {
    const URL = "http://localhost/Proyectos/app-curd/backend/EditUser.php";
    let fData = new FormData();
    fData.append("action", "eliminarventa");
    fData.append("idventa", id);
    fData.append("cantidad", cantidad);
    axios
      .post(URL, fData)
      .then((response) => {
        if (response.data.result === "success") {
          toast.success("Eliminado con Éxito");
          fetchVentas();
        } else {
          toast.error("Error al eliminar la venta");
        }
      })
      .catch((error) => {
        console.error("Error al eliminar la venta:", error);
        setError("Error al realizar la eliminación.");
      });
  };

  const renderCell = (venta, columnKey) => {
    const cellValue = venta[columnKey];
    switch (columnKey) {
      case "nombre_cliente":
      case "cantidad":
      case "nombre_producto":
      case "subtotal":
      case "iva":
      case "total":
        return cellValue;

      case "actions":
        return (
          <div className="relative flex justify-between items-center gap-2">
            <Tooltip color="warning" content="Edit product">
              <span
                onClick={() => handleUserEdit(venta)}
                className="text-lg text-warning cursor-pointer active:opacity-50"
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete product">
              <span
                onClick={() => handleUserDelete(venta)}
                className="text-lg text-danger cursor-pointer active:opacity-50"
              >
                <DeleteIcon />
              </span>
            </Tooltip>
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
        <Table aria-label="Table with sales data" className="w-auto mx-10">
          <TableHeader columns={columnsVentas}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={ventas}>
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

      {editVenta && (
        <Modal
          isOpen={isLoginModalOpen}
          onOpenChange={onLoginModalChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-center">
                  Editar Venta
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="ID Cliente"
                    value={idClient}
                    onChange={(e) => setIdClient(e.target.value)}
                    variant="bordered"
                  />
                  <Input
                    label="ID Producto"
                    value={idProduct}
                    onChange={(e) => setIdProduct(e.target.value)}
                    variant="bordered"
                  />
                  <Input
                    label="Cantidad"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    variant="bordered"
                  />
                  <Input
                    label="Subtotal"
                    value={subtotal}
                    onChange={(e) => setSubtotal(e.target.value)}
                    variant="bordered"
                  />
                  <Input
                    label="IVA"
                    value={iva}
                    onChange={(e) => setIva(e.target.value)}
                    variant="bordered"
                  />
                  <Input
                    label="Total"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
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
                      sendEditVenta(editVenta.idventa);
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

      {datUser && (
        <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex text-center flex-col gap-1">
                  Confirmar Eliminación
                </ModalHeader>
                <ModalBody className="flex flex-col items-center gap-2">
                  <span className="font-bold">
                    ¿Está seguro de que desea eliminar la venta con ID ,
                    {datUser.id} ?
                  </span>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      sendDeleteUser(datUser.id, datUser.cantidad);
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
