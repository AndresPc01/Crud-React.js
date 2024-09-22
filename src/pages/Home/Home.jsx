import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { CircularProgress } from "@nextui-org/react";
import SideBar from "../../components/Sidebar/SideBar";
import Header from "../../components/header/Header";
import "./Home.css";

const Home = () => {
  const [expanMenu, setExpanMenu] = useState(() => {
    const savedState = localStorage.getItem("Menu");
    try {
      return savedState ? JSON.parse(savedState) : true;
    } catch (e) {
      console.error("Invalid JSON in localStorage", e);
      return true;
    }
  });

  const [cargando, setCargando] = useState(() => {
    const savedLoadingState = localStorage.getItem("cargando");
    return savedLoadingState ? JSON.parse(savedLoadingState) : true;
  });

  const handleMenuToggle = (newState) => {
    setExpanMenu(newState);
  };

  const handleLoadComplete = () => {
    setTimeout(() => {
      setCargando(false);
    }, 2000);
  };

  useEffect(() => {
    handleLoadComplete();
  }, []);

  useEffect(() => {
    localStorage.setItem("cargando", JSON.stringify(cargando));
  }, [cargando]);

  if (cargando) {
    return (
      <div className="h-screen flex justify-center items-center">
        <CircularProgress label="Loading..." />
      </div>
    );
  }

  return (
    <div
      className={`Container h-[100vh]   ${
        expanMenu
          ? "grid grid-cols-[300px,1fr] transition-all duration-500 ease  "
          : "grid grid-cols-[100px,1fr]  transition-all duration-500 ease"
      }`}
    >
      <header>
        <Header />
      </header>
      <aside className=" overflow-y-scroll">
        <SideBar menuExpanded={handleMenuToggle} />
      </aside>
      <main>
        <Outlet />
      </main>
      <footer>footer</footer>
    </div>
  );
};

export default Home;
