import { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Alert
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const Resultados = () => {
  const { usuario, token } = useContext(AuthContext);
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/resultados")
      .then(res => {
        setResultados(res.data);
      })
      .catch(err => {
        console.error("Error al obtener resultados", err);
      });
  }, []);

  const handleDelete = (id) => {
    if (usuario?.rol !== "cronometrista") return;
    if (!window.confirm("¿Eliminar este resultado?")) return;

    axios
      .delete(`http://localhost:3001/api/resultados/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        setResultados(r => r.filter(item => item.idResultado !== id));
        setMensaje("Resultado eliminado");
      })
      .catch(() => {
        setMensaje("Error al eliminar resultado");
      });
  };

  const handleEdit = (id) => {
    if (usuario?.rol !== "cronometrista") return;
    navigate("/cronometrista");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Resultados Oficiales
      </Typography>

      {mensaje && (
        <Alert
          severity={mensaje.includes("Error") ? "error" : "success"}
          sx={{ mb: 2 }}
        >
          {mensaje}
        </Alert>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Evento</TableCell>
            <TableCell>ID Usuario</TableCell>
            <TableCell>Tiempo</TableCell>
            <TableCell>Pos. General</TableCell>
            <TableCell>Pos. Cat.</TableCell>
            {usuario?.rol === "cronometrista" && (
              <TableCell>Acciones</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {resultados.map(r => (
            <TableRow key={r.idResultado}>
              <TableCell>{r.idEvento}</TableCell>
              <TableCell>{r.idUsuario}</TableCell>
              <TableCell>{r.tiempoOficial}</TableCell>
              <TableCell>{r.posicionGeneral}</TableCell>
              <TableCell>{r.posicionCategoria}</TableCell>
              {usuario?.rol === "cronometrista" && (
                <TableCell>
                  <IconButton onClick={() => handleEdit(r.idResultado)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(r.idResultado)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Resultados;