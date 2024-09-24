import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { CircularProgress } from "@nextui-org/react";
import SideBar from "../../components/Sidebar/SideBar";
import Header from "../../components/header/Header";
import AgregarUsuario from "../../pages/Usuario/AgregarUsuario";
import "./Home.css";
import AgregarProveedor from "../Proveedores/AgregarProveedor";
import AgregarProducto from "../Productos/AgregarProducto";
import AgregarCliente from "../Cliente/AgregarCliente";
import AgregarVenta from "../Ventas/AgregarVenta";

const Home = () => {
  const [expanMenu, setExpanMenu] = useState(() => {
    const savedState = localStorage.getItem("Menu");
    return savedState ? JSON.parse(savedState) : true;
  });

  const [modalType, setModalType] = useState(() => {
    const savedModalType = localStorage.getItem("modalType");
    return savedModalType ? JSON.parse(savedModalType) : null;
  });

  const [cargando, setCargando] = useState(() => {
    const savedCargando = localStorage.getItem("cargando");
    return savedCargando ? JSON.parse(savedCargando) : true;
  });

  const handleMenuToggle = (newState) => {
    setExpanMenu(newState);
    localStorage.setItem("Menu", JSON.stringify(newState));
  };

  const handleLoadComplete = () => {
    setTimeout(() => {
      setCargando(false);
    }, 1000);
  };

  useEffect(() => {
    handleLoadComplete();
  }, []);

  useEffect(() => {
    localStorage.setItem("cargando", JSON.stringify(cargando));
  }, [cargando]);

  useEffect(() => {
    localStorage.setItem("modalType", JSON.stringify(modalType));
  }, [modalType]);

  if (cargando) {
    return (
      <div className="h-screen flex justify-center items-center">
        <CircularProgress label="Loading..." />
      </div>
    );
  }

  const handleClose = () => {
    setModalType(null);
  };

  const openModal = (type) => {
    setModalType(type);
  };

  return (
    <div
      className={`Container h-[100vh] ${
        expanMenu
          ? "grid grid-cols-[300px,1fr] transition-all duration-500 ease"
          : "grid grid-cols-[100px,1fr] transition-all duration-500 ease"
      }`}
    >
      <header>
        <Header />
      </header>
      <aside className="overflow-y-scroll">
        <SideBar openModal={openModal} menuExpanded={handleMenuToggle} />
      </aside>
      <main className="overflow-y-scroll">
        <Outlet />
        {modalType === "Usuario" && (
          <AgregarUsuario
            isOpen={modalType === "Usuario"}
            onClose={handleClose}
          />
        )}
        {modalType === "Cliente" && (
          <AgregarCliente
            isOpen={modalType === "Cliente"}
            onClose={handleClose}
          />
        )}
        {modalType === "Proveedor" && (
          <AgregarProveedor
            isOpen={modalType === "Proveedor"}
            onClose={handleClose}
          />
        )}
        {modalType === "Producto" && (
          <AgregarProducto
            isOpen={modalType === "Producto"}
            onClose={handleClose}
          />
        )}
        {modalType === "Venta" && (
          <AgregarVenta isOpen={modalType === "Venta"} onClose={handleClose} />
        )}
      </main>
      <footer>footer</footer>
    </div>
  );
};

export default Home;
