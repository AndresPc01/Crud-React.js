import axios from "axios";
import "../../colors.css";
import "./Login.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@nextui-org/react";
const Login = () => {
  const [ShowPassword, setShowPassword] = useState(false);
  const [ShowPerfil, setShowPerfil] = useState(true);
  const [username, setUsername] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!ShowPassword);
  };

  const toggleVisibilityPerfil = () => {
    setShowPerfil(!ShowPerfil);
  };

  const enviarFormulario = () => {
    if (username.length === 0) {
      setError("usuario vacio");
    } else if (contraseña.length === 0) {
      setError("contraseña vacia");
    } else {
      const url = "http://localhost/Proyectos/app-curd/backend/Login.php";

      let fData = new FormData();
      fData.append("username", username);
      fData.append("contraseña", contraseña);

      axios
        .post(url, fData)
        .then((response) => {
          if (response.data === "success") {
            setLoading(true);
            setTimeout(() => {
              navigate("/Home");
            }, 2000);
          } else {
            setError("User name o contraseña Incorrectos");
          }
        })
        .catch((error) => setError(error));
    }
  };

  return (
    <>
      {loading && (
        <div className="flex flex-col justify-center items-center absolute inset-0 bg-black bg-opacity-60 z-10">
          <CircularProgress aria-label="Redirigiendo a Login .." />
          <span className="text-white mt-4">Redirigiendo a Home...</span>
        </div>
      )}
      <section className="flex justify-center items-center mt-20">
        <div className="flex">
          <div className="flex flex-col w-[500px] h-auto p-10 text-center rounded-md bg-[#37404A]">
            <span className="text-red-600">{error}</span>
            <h2 className="text-white text-xl mb-6">Loguéate</h2>

            <div className="flex flex-col gap-6">
              <label htmlFor="username" className="text-start text-white">
                Usuario
                <input
                  id="username"
                  value={username}
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-2 p-3 rounded-md w-full bg-gray-700 outline-none text-white"
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
                    type={ShowPassword ? "text" : "password"}
                    onChange={(e) => setContraseña(e.target.value)}
                    className="mt-2 p-3 rounded-md w-full bg-gray-700 text-white outline-none"
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
              <button
                onClick={enviarFormulario}
                id="submitform"
                className="p-4 rounded-md"
              >
                Iniciar Sesion
              </button>
            </div>
            <button
              onClick={toggleVisibilityPerfil}
              className="p-4 mt-7 bg-blue-200 text-black rounded-md"
            >
              completar perfil
            </button>
          </div>
        </div>
      </section>

      {ShowPerfil ? (
        " "
      ) : (
        <section className="absolute top-0 left-0 right-0 min-h-screen flex items-center backdrop-blur-lg justify-center p-4">
          <div className="w-full max-w-2xl min-h-[80vh] bg-[#37404A] p-8 rounded-md">
            <h2 className="text-white text-center text-2xl mb-4">
              Completa tu perfil
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex gap-5">
                <label htmlFor="name" className="text-start text-white w-full">
                  Nombre
                  <input
                    id="name"
                    type="text"
                    readOnly
                    className="mt-2 p-3 rounded-md w-full bg-gray-700 outline-none text-white"
                  />
                </label>
                <label
                  htmlFor="Password"
                  className="text-start text-white w-full"
                >
                  Contraseña
                  <input
                    id="Password"
                    type="password"
                    readOnly
                    className="mt-2 p-3 rounded-md w-full bg-gray-700 outline-none text-white"
                  />
                </label>
              </div>

              <div className="flex gap-5">
                <label
                  htmlFor="Username"
                  className="text-start text-white w-full"
                >
                  Usuario
                  <input
                    id="Username"
                    type="text"
                    readOnly
                    className="mt-2 p-3 rounded-md w-full bg-gray-700 outline-none text-white"
                  />
                </label>
                <label
                  htmlFor="Genero"
                  className="text-start text-white w-full"
                >
                  Género
                  <select
                    id="Genero"
                    className="mt-2 p-3 rounded-md w-full bg-gray-700 outline-none text-white"
                  >
                    <option value="">Selecciona</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </label>
              </div>

              <div className="flex gap-5">
                <label
                  htmlFor="PhoneNumber"
                  className="text-start text-white w-full"
                >
                  Número Telefónico
                  <input
                    id="PhoneNumber"
                    type="text"
                    className="mt-2 p-3 rounded-md w-full bg-gray-700 outline-none text-white"
                  />
                </label>
                <label htmlFor="City" className="text-start text-white w-full">
                  Ciudad
                  <input
                    id="City"
                    type="text"
                    className="mt-2 p-3 rounded-md w-full bg-gray-700 outline-none text-white"
                  />
                </label>
              </div>

              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  className="w-full p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Guardar
                </button>
              </div>
              <button
                onClick={toggleVisibilityPerfil}
                className="mt-2 p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Salir
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Login;
