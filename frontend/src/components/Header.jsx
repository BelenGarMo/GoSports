import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/gosports.png";

const Header = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: 2 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
        >
          <img src={logo} alt="GoSports" style={{ height: 50 }} />
        </Box>

        {/* Navegación */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button component={Link} to="/" sx={{ color: "black" }}>
            Inicio
          </Button>
          <Button component={Link} to="/calendario" sx={{ color: "black" }}>
            Calendario
          </Button>
          <Button component={Link} to="/resultados" sx={{ color: "black" }}>
            Resultados
          </Button>
          <Button component={Link} to="/inscripciones" sx={{ color: "black" }}>
            Inscripciones
          </Button>

          {!usuario && (
            <>
              <Button component={Link} to="/registro" sx={{ color: "black" }}>
                Registrarse
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{ bgcolor: "primary.main", color: "white" }}
              >
                Iniciar sesión
              </Button>
            </>
          )}

          {usuario && (
            <>
              {usuario.rol === "organizador" && (
                <Button
                  component={Link}
                  to="/organizador"
                  sx={{ color: "black" }}
                >
                  Panel Org.
                </Button>
              )}
              {usuario.rol === "cronometrista" && (
                <Button
                  component={Link}
                  to="/cronometrista"
                  sx={{ color: "black" }}
                >
                  Panel Crono.
                </Button>
              )}
              <Button onClick={handleLogout} sx={{ color: "black" }}>
                Cerrar sesión
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;