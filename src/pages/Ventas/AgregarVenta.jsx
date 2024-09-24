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

  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [idestado, setIdestado] = useState("");
  const [idperfil, setIdperfil] = useState("");

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
      onOpen(); // Aquí llamas a onOpen de useDisclosure
    } else {
      modalClose(); // Aquí llamas a modalClose de useDisclosure
    }
  }, [isOpen, onOpen, modalClose]);

  const sendUsuario = () => {
    const url = "http://localhost/Proyectos/app-curd/backend/GetData.php";
    let fData = new FormData();
    fData.append("cliente", usuario);
    fData.append("cantidad", contraseña);
    fData.append("producto", nombre);
    fData.append("subtotal", email);
    fData.append("iva", idestado);
    fData.append("total", idperfil);

    axios
      .post(url, fData)
      .then((response) => {
        console.log(response.data);
        if (
          response.data.sendUsuario &&
          response.data.sendUsuario.result === "success"
        ) {
          toast.success("Usuario registrado con éxito");
          onClose();
        } else {
          toast.error(
            response.data.sendUsuario.error || "Error al registrar usuario"
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
                onChange={(e) => setEmail(e.target.value)}
              />
              <Select
                className="w-full"
                placeholder="Selecciona Producto"
                aria-label="Producto"
                name="idproducto"
              >
                {productodata.map((producto) => (
                  <SelectItem
                    onPress={() => setIdperfil(producto.id)}
                    key={producto.id}
                  >
                    {producto.nombre}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="subtotal"
                variant="bordered"
                aria-label="subtotal"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="iva"
                variant="bordered"
                aria-label="iva"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="total"
                variant="bordered"
                aria-label="total"
                onChange={(e) => setEmail(e.target.value)}
              />
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
