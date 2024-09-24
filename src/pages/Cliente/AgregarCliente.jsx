/* eslint-disable react/prop-types */
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

export default function AgregarCliente({ isOpen, onClose }) {
  const { isOpen: modalOpen, onOpen, onClose: modalClose } = useDisclosure();

  const [identidad, setIdentidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [idestado_cliente, setIdestado_cliente] = useState(0);

  useEffect(() => {
    if (isOpen) {
      onOpen();
    } else {
      modalClose();
    }
  }, [isOpen, onOpen, modalClose]);

  const sendUsuario = () => {
    if (!identidad || !nombre || !telefono || !direccion || !idestado_cliente) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    const url = "http://localhost/Proyectos/app-curd/backend/GetData.php";
    let fData = new FormData();
    fData.append("identidad", identidad);
    fData.append("nombre", nombre);
    fData.append("telefono", telefono);
    fData.append("direccion", direccion);
    fData.append("idestado_cliente", idestado_cliente);

    axios
      .post(url, fData)
      .then((response) => {
        if (
          response.data.sendCliente &&
          response.data.sendCliente.result === "success"
        ) {
          toast.success("Cliente registrado con éxito");
          setTimeout(() => {
            onClose();
          }, 2000);
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
      </div>

      <Modal size={"5xl"} isOpen={modalOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Agregar cliente
          </ModalHeader>
          <ModalBody className="grid grid-cols-2">
            <Input
              label="Identidad"
              variant="bordered"
              aria-label="identidad"
              onChange={(e) => setIdentidad(e.target.value)}
            />
            <Input
              label="Nombre"
              variant="bordered"
              aria-label="nombre"
              onChange={(e) => setNombre(e.target.value)}
            />
            <Input
              label="Teléfono"
              variant="bordered"
              aria-label="telefono"
              onChange={(e) => setTelefono(e.target.value)}
            />
            <Input
              label="Dirección"
              variant="bordered"
              aria-label="direccion"
              onChange={(e) => setDireccion(e.target.value)}
            />
            <Select
              className="w-full"
              placeholder="Selecciona el estado H o D"
              aria-label="Estado"
            >
              <SelectItem
                onPress={(e) => setIdestado_cliente(e.target.value)}
                value={1}
              >
                Habilitado
              </SelectItem>
              <SelectItem
                onPress={(e) => setIdestado_cliente(e.target.value)}
                value={2}
              >
                Deshabilitado
              </SelectItem>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={sendUsuario}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
