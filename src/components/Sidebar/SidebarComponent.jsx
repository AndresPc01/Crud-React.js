import { useEffect, useState } from "react";
import { DataSideBar } from "../data/data";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const SidebarComponent = ({ expanMenu }) => {
  const [ShowMenu, setShowMenu] = useState(() => {
    const savedState = localStorage.getItem("Estado");
    try {
      return savedState ? JSON.parse(savedState) : {}; // Si es válido, lo usa; si no, inicializa con un objeto vacío
    } catch (e) {
      console.error("Invalid JSON in localStorage", e); // Mostrar el error en la consola
      return {}; // Devolver objeto vacío si hay un error
    }
  });

  useEffect(() => {
    localStorage.setItem("Estado", JSON.stringify(ShowMenu));
  }, [ShowMenu]);

  const abrirmenu = (menu) => {
    setShowMenu((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  return (
    <>
      {DataSideBar.map((item) => {
        const isActive = ShowMenu[item.menu];
        return expanMenu ? (
          <li key={item.menu} className="flex flex-col ">
            <span
              onClick={() => abrirmenu(item.menu)}
              className={`hover:bg-slate-600 mx-6 text-white p-4 hover:cursor-pointer flex gap-14 font-semibold rounded-lg ${
                isActive ? "bg-slate-600" : ""
              }`}
            >
              <span className="material-symbols-outlined select-none ">
                {item.icon}
              </span>
              {item.nombre}
            </span>
            {isActive && (
              <div>
                <ul className="select-none flex flex-col gap-2 mt-2 px-14 shadow-sm">
                  <li className="p-3 hover:bg-slate-600 hover:cursor-pointer rounded-lg transition-colors text-nowrap">
                    <Link to={item.DesConsult}>Consultar {item.menu}</Link>
                  </li>
                  <li className="p-3 hover:bg-slate-600 hover:cursor-pointer rounded-lg transition-colors text-nowrap">
                    Agregar {item.menu}
                  </li>
                </ul>
              </div>
            )}
          </li>
        ) : (
          <li
            key={item.menu}
            className="flex flex-col mt-9 transition-all duration-500 ease "
          >
            <span
              onClick={() => abrirmenu(item.menu)}
              className={`hover:bg-slate-600 mx-6 text-white p-3 hover:cursor-pointer flex gap-14 font-semibold rounded-lg ${
                isActive ? "bg-slate-600" : ""
              }`}
            >
              <span className="material-symbols-outlined select-none">
                {item.icon}
              </span>
            </span>
            {isActive && (
              <div>
                <ul
                  className="block w-52 select-none mt-[-50px] absolute z-10 flex-col gap-2 mx-[100px] border-t-[1px] border-e-[1px] border-b-[1px] border-[#414A58] 
                bg-background-sidebar rounded-tr-lg rounded-br-lg shadow-sm "
                >
                  <li className="p-3 hover:bg-slate-600 hover:cursor-pointer rounded-lg transition-colors ">
                    <Link to={item.DesConsult}>Consultar {item.menu}</Link>
                  </li>
                  <li className="p-3 hover:bg-slate-600 hover:cursor-pointer rounded-lg transition-colors text-nowrap">
                    Agregar {item.menu}
                  </li>
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </>
  );
};

export default SidebarComponent;
