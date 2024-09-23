import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import ConsulUsuario from "./pages/Usuario/ConsulUsuario";
import ConsulClientes from "./pages/Cliente/ConsulClientes";
import ConsulProveedor from "./pages/Proveedores/ConsulProveedor";
import ConsulProductos from "./pages/Productos/ConsulProductos";
import ConsulVentas from "./pages/Ventas/ConsulVentas";
import Dashboard from "./pages/Dashboard/Dashboard";
import LandingPage from "./pages/LandingPage";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Landing />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
          </Route>

          <Route element={<Home />}>
            <Route path="/Home" element={<Dashboard />} />
            <Route path="/Usuarios" element={<ConsulUsuario />} />
            <Route path="/Clientes" element={<ConsulClientes />} />
            <Route path="/Proveedores" element={<ConsulProveedor />} />
            <Route path="/Productos" element={<ConsulProductos />} />
            <Route path="/Ventas" element={<ConsulVentas />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
