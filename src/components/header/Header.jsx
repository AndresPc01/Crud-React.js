import { useState } from "react";

const Header = () => {
  const [ShowMenuPerfil, setShowMenuPerfil] = useState(false);

  const toggleMenuShow = () => {
    setShowMenuPerfil(!ShowMenuPerfil);
  };

  return (
    <section className="flex justify-between   items-center bg-background-header w-full h-16 ">
      <div className="flex mx-5">App</div>
      <div className="flex justify-center items-center relative">
        <div
          onClick={toggleMenuShow}
          className="bg-[#3C4655] border-[1px] border-[#464F5B] p-2 mx-3 px-10 text-center hover:cursor-pointer"
        >
          <h3 className="font-bold">Nombre</h3>
          <h4>Rol</h4>
        </div>
        <div
          className={`absolute z-10  top-16 bg-[#37404A] border-[1px] border-[#464F5B] min-w-[140px] transition-all duration-300 ease-in-out transform ${
            ShowMenuPerfil
              ? "opacity-100 scale-100 "
              : "opacity-0 scale-95 pointer-events-none "
          }`}
        >
          <ul className="flex flex-col gap-2 w-full ">
            <li className="hover:bg-[#404954] w-full px-4 py-2">Perfil</li>
            <li className="hover:bg-[#404954] w-full px-4 py-2">
              Cerrar Sesión
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Header;
