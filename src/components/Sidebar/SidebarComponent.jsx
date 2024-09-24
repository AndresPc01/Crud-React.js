/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { DataSideBar } from "../data/data";
import { Link } from "react-router-dom";
const SidebarComponent = ({ expanMenu, openModal }) => {
  const [ShowMenu, setShowMenu] = useState(() => {
    const savedState = localStorage.getItem("Estado");
    return savedState ? JSON.parse(savedState) : {};
  });

  useEffect(() => {
    localStorage.setItem("Estado", JSON.stringify(ShowMenu));
  }, [ShowMenu]);

  const abrirMenu = (menu) => {
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
          <li key={item.menu} className="flex flex-col">
            <span
              onClick={() => abrirMenu(item.menu)}
              className={`hover:bg-slate-600 mx-6 text-white p-4 hover:cursor-pointer flex gap-14 font-semibold rounded-lg ${
                isActive ? "bg-slate-600" : ""
              }`}
            >
              <span className="material-symbols-outlined select-none">
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
                    <span
                      onClick={() => {
                        console.log(`Abriendo modal para: ${item.menu}`);
                        openModal(item.menu);
                      }}
                    >
                      Agregar {item.menu}
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </li>
        ) : (
          <li
            key={item.menu}
            className="flex flex-col mt-9 transition-all duration-500 ease"
          >
            <span
              onClick={() => abrirMenu(item.menu)}
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
                <ul className="block w-52 select-none mt-[-50px] absolute z-10 flex-col gap-2 mx-[100px] border-t-[1px] border-e-[1px] border-b-[1px] border-[#414A58] bg-background-sidebar rounded-tr-lg rounded-br-lg shadow-sm">
                  <li className="p-3 hover:bg-slate-600 hover:cursor-pointer rounded-lg transition-colors">
                    <Link to={item.DesConsult}>Consultar {item.menu}</Link>
                  </li>
                  <li className="p-3 hover:bg-slate-600 hover:cursor-pointer rounded-lg transition-colors text-nowrap">
                    <span
                      onClick={() => {
                        openModal(item.menu);
                      }}
                    >
                      Agregar {item.menu}
                    </span>
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
