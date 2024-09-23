import { useState } from "react";
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

export default function AgregarProveedor({ isOpen, onClose }) {
  const { isOpen: modalOpen, onOpen, onClose: modalClose } = useDisclosure();
  const [size, setSize] = useState("md");
  const sizes = ["5xl"];

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [idestado_proveedor, setIdestado_proveedor] = useState("");

  const handleOpen = (size) => {
    setSize(size);
    onOpen();
  };

  const sendUsuario = () => {
    const url = "http://localhost/Proyectos/app-curd/backend/GetData.php";
    let fData = new FormData();
    fData.append("nombre_proveedor", nombre);
    fData.append("telefono_proveedor", telefono);
    fData.append("ciudad_proveedor", ciudad);
    fData.append("estado_proveedor", idestado_proveedor);

    axios
      .post(url, fData)
      .then((response) => {
        console.log(response.data);
        if (
          response.data.sendCliente &&
          response.data.sendCliente.result === "success"
        ) {
          toast.success("Cliente registrado con éxito");
          onClose();
        } else {
          toast.error(
            response.data.sendCliente.error || "Error al registrar Cliente"
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
                Agregar Proveedor
              </ModalHeader>
              <ModalBody className="grid grid-cols-2">
                <Input
                  label="nombre "
                  variant="bordered"
                  aria-label="nombre "
                  onChange={(e) => setNombre(e.target.value)}
                />
                <Input
                  label="telefono "
                  variant="bordered"
                  aria-label="telefono "
                  onChange={(e) => setTelefono(e.target.value)}
                />
                <Input
                  label="Ciudad"
                  variant="bordered"
                  aria-label="Ciudad"
                  onChange={(e) => setCiudad(e.target.value)}
                />
                <Select
                  className="w-full"
                  placeholder="Selecciona el estado H o D"
                  name="idestado"
                  aria-label="Estado"
                >
                  <SelectItem
                    value={1}
                    onPress={(e) => setIdestado_proveedor(e.target.value)}
                  >
                    Habilitado
                  </SelectItem>
                  <SelectItem
                    value={2}
                    onPress={(e) => setIdestado_proveedor(e.target.value)}
                  >
                    Desabilitado
                  </SelectItem>
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
