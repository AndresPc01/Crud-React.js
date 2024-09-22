import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import "../colors.css";

const Landing = () => {
  const [showActive, setShowActive] = useState(false);
  const toggleActive = () => {
    setShowActive(!showActive);
  };

  return (
    <>
      <section className="flex flex-col w-full h-screen">
        <div className="flex justify-end p-5 m-2 bg-[#3A444E]">
          <ul className="flex gap-5">
            <li className="bg-[#2D3E45] p-3 rounded-lg text-lg transition-colors duration-1000 ease-in-out hover:bg-[#1A2B2F] first:bg-transparent first:hover:bg-[#1A2B2F]">
              {showActive ? (
                <Link onClick={toggleActive} to={"/"}>
                  Pagina Principal
                </Link>
              ) : (
                <Link onClick={toggleActive} to={"Login"}>
                  Iniciar Sesion
                </Link>
              )}
            </li>
            <li className="bg-[#2D3E45] p-3 rounded-lg text-lg transition-colors duration-1000 ease-in-out hover:bg-[#1A2B2F]">
              <Link onClick={toggleActive} to={"Register"}>
                Registrarse
              </Link>
            </li>
          </ul>
        </div>
        <section className="flex-grow">
          <Outlet />
        </section>
      </section>
    </>
  );
};

export default Landing;
