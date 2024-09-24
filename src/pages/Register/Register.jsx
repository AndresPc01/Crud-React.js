import {
  Button,
  CircularProgress,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [ShowPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [contraseña, setContraseña] = useState("");

  const [errors, setErrors] = useState({
    name: false,
    username: false,
    contraseña: false,
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!ShowPassword);
  };

  const RegistrarUser = () => {
    const newErrors = {
      name: name.length === 0,
      username: username.length === 0,
      contraseña: contraseña.length === 0,
    };

    setErrors(newErrors);
    if (newErrors.name || newErrors.username || newErrors.contraseña) {
      return;
    }

    onOpen();
  };

  const handleConfirm = () => {
    const Url = "http://localhost/Proyectos/app-curd/backend/Register.php";
    let forData = new FormData();
    forData.append("nombre", name);
    forData.append("username", username);
    forData.append("contraseña", contraseña);

    axios
      .post(Url, forData)
      .then((response) => {
        if (response.data === "success") {
          <CircularProgress aria-label="Redirigiendo a Login .." />;
          setTimeout(() => {
            navigate("/Login");
          }, 2000);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <section className="flex justify-center items-center mt-20">
      <div className="flex">
        <div className="flex flex-col w-[500px] h-auto p-10 text-center rounded-md bg-[#37404A]">
          <h2 className="text-white text-xl mb-6">Registrate</h2>
          <div className="flex flex-col gap-6">
            <label htmlFor="name" className="text-start text-white">
              Nombre
              <input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.length > 0)
                    setErrors((prev) => ({ ...prev, name: false }));
                }}
                type="text"
                className={`mt-2 p-3 rounded-md w-full bg-gray-700 outline-none text-white ${
                  errors.name ? "border-1 border-red-600" : ""
                }`}
              />
            </label>

            <label htmlFor="username" className="text-start text-white">
              Usuario
              <input
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (e.target.value.length > 0)
                    setErrors((prev) => ({ ...prev, username: false }));
                }}
                type="text"
                className={`mt-2 p-3 rounded-md w-full bg-gray-700 outline-none text-white ${
                  errors.username ? "border-1 border-red-600" : ""
                }`}
              />
            </label>

            <label
              htmlFor="password"
              className="text-start text-white relative"
            >
              Contraseña
              <div className="relative">
                <input
                  id="password"
                  value={contraseña}
                  onChange={(e) => {
                    setContraseña(e.target.value);
                    if (e.target.value.length > 0)
                      setErrors((prev) => ({ ...prev, contraseña: false }));
                  }}
                  type={ShowPassword ? "text" : "password"}
                  className={`mt-2 p-3 rounded-md w-full bg-gray-700 text-white outline-none ${
                    errors.contraseña ? "border-1 border-red-600" : ""
                  }`}
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-5 cursor-pointer text-gray-400 outline-none"
                >
                  {ShowPassword ? (
                    <span className="material-symbols-outlined">
                      visibility_off
                    </span>
                  ) : (
                    <span className="material-symbols-outlined">
                      visibility
                    </span>
                  )}
                </span>
              </div>
            </label>

            <Button
              id="submitform"
              className="p-4 rounded-md"
              onClick={RegistrarUser}
            >
              Registrarse
            </Button>

            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              isDismissable={false}
              isKeyboardDismissDisabled={true}
            >
              <ModalContent className="bg-black ">
                <ModalHeader className="flex flex-col text-center gap-1">
                  Confirmacion de Registro
                </ModalHeader>
                <ModalBody>
                  <p>
                    Al darle confirmar si todo sale correcto se redireccionara
                    hacia el login para que ingrese su usuario y contraseña
                    anterior.
                  </p>
                  <p>
                    Al presionar Confirmar acepta nuestros términos y
                    condiciones.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onOpenChange}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      handleConfirm();
                      onOpenChange();
                    }}
                  >
                    Confirmar
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
