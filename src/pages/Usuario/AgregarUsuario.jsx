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

export default function AgregarUsuario({ isOpen, onClose }) {
  const [perfildata, setPerfildata] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isOpen: modalOpen, onOpen, onClose: modalClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

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
        setPerfildata(response.data.perfil);
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
    fData.append("usuario", usuario);
    fData.append("contraseña", contraseña);
    fData.append("nombre", nombre);
    fData.append("email", email);
    fData.append("idestado", idestado);
    fData.append("idperfil", idperfil);

    axios
      .post(url, fData)
      .then((response) => {
        console.log(response.data);
        if (
          response.data.sendUsuario &&
          response.data.sendUsuario.result === "success"
        ) {
          toast.success("Usuario registrado con éxito");
          setTimeout(() => {
            onClose();
          }, 2000);
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
              Agregar Usuario
            </ModalHeader>
            <ModalBody className="grid grid-cols-2">
              <Input
                label="Usuario"
                variant="bordered"
                isRequired
                aria-label="Usuario"
                onChange={(e) => setUsuario(e.target.value)}
              />
              <Input
                label="Contraseña"
                variant="bordered"
                isRequired
                type={isVisible ? "text" : "password"}
                aria-label="Contraseña"
                onChange={(e) => setContraseña(e.target.value)}
              />
              <Input
                label="Nombre"
                variant="bordered"
                isRequired
                aria-label="Nombre"
                onChange={(e) => setNombre(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                isRequired
                variant="bordered"
                aria-label="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Select
                className="w-full"
                placeholder="Selecciona el estado"
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
                placeholder="Selecciona el tipo de perfil"
                aria-label="Tipo de perfil"
                name="idperfil"
              >
                {perfildata.map((perfi) => (
                  <SelectItem
                    onPress={() => setIdperfil(perfi.id)}
                    key={perfi.id}
                  >
                    {perfi.nombre_perfil}
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
