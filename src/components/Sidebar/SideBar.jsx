import SidebarComponent from "./SidebarComponent";
import "../../colors.css";
import { useEffect, useState } from "react";
// eslint-disable-next-line react/prop-types
const SideBar = ({ menuExpanded }) => {
  const [ExpanMenu, setExpanMenu] = useState(() => {
    const savedState = localStorage.getItem("Menu");
    try {
      return savedState ? JSON.parse(savedState) : true; // Si es válido, lo usa; si no, inicializa con un objeto vacío
    } catch (e) {
      console.error("Invalid JSON in localStorage", e); // Mostrar el error en la consola
      return true; // Devolver objeto vacío si hay un error
    }
  });

  useEffect(() => {
    localStorage.setItem("Menu", JSON.stringify(ExpanMenu));
  }, [ExpanMenu]);

  const toogleExpanMenu = () => {
    setExpanMenu(!ExpanMenu);
    if (menuExpanded) menuExpanded(!ExpanMenu);
  };
  return (
    <section className="flex flex-col justify-between min-h-full overflow-hidden">
      <div className="flex mt-2 mx-3">
        {menuExpanded ? (
          <div className=" w-full flex justify-end rounded-lg transition duration-200 ">
            <span
              onClick={toogleExpanMenu}
              className="material-symbols-outlined p-4 hover:bg-slate-700 hover:cursor-pointer "
            >
              Menu
            </span>
          </div>
        ) : (
          <span className="material-symbols-outlined p-4 hover:bg-slate-700 hover:cursor-pointer mx-2 rounded-lg">
            Menu
          </span>
        )}
      </div>

      <div className="flex flex-col rounded-lg">
        <ul className="flex flex-col gap-4 w-full">
          <SidebarComponent expanMenu={ExpanMenu} />
        </ul>
      </div>

      <div className="flex mt-10 mb-5 mx-4">
        {ExpanMenu ? (
          <button className="p-4 w-full bg-primary-color-button rounded-lg hover:bg-hover-color-button transition duration-200 text-nowrap ">
            Cerrar Sesion
          </button>
        ) : (
          <span className="material-symbols-outlined p-4 hover:bg-slate-700 hover:cursor-pointer mx-2 rounded-lg">
            logout
          </span>
        )}
      </div>
    </section>
  );
};

export default SideBar;
