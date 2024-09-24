import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AgregarVenta({ isOpen, onClose }) {
  const [clientedata, setClientedata] = useState([]);
  const [productodata, setProductodata] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isOpen: modalOpen, onOpen, onClose: modalClose } = useDisclosure();

  const [perfil, setIdperfil] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [producto, setProducto] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost/Proyectos/app-curd/backend/GetData.php"
        );
        setProductodata(response.data.producto);
        setClientedata(response.data.cliente);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      onOpen();
    } else {
      modalClose();
    }
  }, [isOpen, onOpen, modalClose]);

  const sendUsuario = () => {
    const url = "http://localhost/Proyectos/app-curd/backend/GetData.php";
    let fData = new FormData();
    fData.append("idperfil", perfil);
    fData.append("cantidad", cantidad);
    fData.append("producto", producto);

    axios
      .post(url, fData)
      .then((response) => {
        if (
          response.data.sendVenta &&
          response.data.sendVenta.result === "success"
        ) {
          toast.success("venta registrada con éxito");
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          toast.error(
            response.data.sendVenta.error || "Error al registrar usuario"
          );
        }
      })
      .catch((error) => {
        toast.error("Error al realizar la solicitud: " + error.message);
      });
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <ToastContainer className={"absolute z-10 right-0 top-0"} />
      </div>
      <Modal size={"5xl"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Agregar Venta
            </ModalHeader>
            <ModalBody className="grid grid-cols-2">
              <Select
                className="w-full"
                placeholder="Selecciona Cliente"
                aria-label="Cliente"
                name="idcliente"
              >
                {clientedata.map((cliente) => (
                  <SelectItem
                    onPress={() => setIdperfil(cliente.id)}
                    key={cliente.id}
                  >
                    {cliente.nombre}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="cantidad"
                variant="bordered"
                aria-label="cantidad"
                onChange={(e) => setCantidad(e.target.value)}
              />
              <Select
                className="w-full"
                placeholder="Selecciona Producto"
                aria-label="Producto"
                name="idproducto"
              >
                {productodata.map((producto) => (
                  <SelectItem
                    onPress={() => setProducto(producto.id)}
                    key={producto.id}
                  >
                    {producto.nombre}
                  </SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={() => sendUsuario()}>
                Guardar
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
