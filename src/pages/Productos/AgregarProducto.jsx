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

export default function AgregarProducto({ isOpen, onClose }) {
  const [perfildata, setPerfildata] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isOpen: modalOpen, onOpen, onClose: modalClose } = useDisclosure();
  const [size, setSize] = useState("md");
  const sizes = ["5xl"];

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [idestado, setIdestado] = useState("");
  const [idproveedor, setIdproveedor] = useState("");

  const handleOpen = (size) => {
    setSize(size);
    onOpen();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost/Proyectos/app-curd/backend/GetData.php"
        );
        setPerfildata(response.data.proveedores);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sendUsuario = () => {
    const url = "http://localhost/Proyectos/app-curd/backend/GetData.php";
    let fData = new FormData();
    fData.append("nombre", nombre);
    fData.append("precio", precio);
    fData.append("cantidad", cantidad);
    fData.append("idestado", idestado);
    fData.append("idproveedor", idproveedor);

    axios
      .post(url, fData)
      .then((response) => {
        console.log(response.data);
        if (
          response.data.sendProveedor &&
          response.data.sendProveedor.result === "success"
        ) {
          toast.success("Usuario registrado con éxito");
          onClose();
        } else {
          toast.error(
            response.data.sendProveedor.error || "Error al registrar usuario"
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

        {sizes.map((size) => (
          <Button key={size} onPress={() => handleOpen(size)}>
            Open {size}
          </Button>
        ))}
      </div>
      <Modal size={"5xl"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Agregar Producto
              </ModalHeader>
              <ModalBody className="grid grid-cols-2">
                <Input
                  label="Nombre"
                  variant="bordered"
                  aria-label="NOmbre Producto"
                  onChange={(e) => setNombre(e.target.value)}
                />
                <Input
                  label="Cantidad"
                  variant="bordered"
                  aria-label="Cantidad Producto"
                  onChange={(e) => setCantidad(e.target.value)}
                />
                <Input
                  label="Precio"
                  variant="bordered"
                  aria-label="Precio Unidad"
                  onChange={(e) => setPrecio(e.target.value)}
                />
                <Select
                  className="w-full"
                  placeholder="Selecciona el estado H o D"
                  name="idestado"
                  aria-label="Estado"
                >
                  <SelectItem
                    value={1}
                    onPress={(e) => setIdestado(e.target.value)}
                  >
                    Habilitado
                  </SelectItem>
                  <SelectItem
                    value={2}
                    onPress={(e) => setIdestado(e.target.value)}
                  >
                    Desabilitado
                  </SelectItem>
                </Select>
                <Select
                  className="w-full"
                  placeholder="Selecciona al proveedor"
                  aria-label="proveedores disponibles"
                  name="idproveedor"
                >
                  {perfildata.map((proveedores) => (
                    <SelectItem
                      onPress={() => setIdproveedor(proveedores.id)}
                      key={proveedores.id}
                    >
                      {proveedores.nombre_proveedor}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => sendUsuario()}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
