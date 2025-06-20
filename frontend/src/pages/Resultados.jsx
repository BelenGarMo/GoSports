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
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const Resultados = () => {
  const { usuario, token } = useContext(AuthContext);
  const [resultados, setResultados] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  // Traer eventos y cargar resultados del primero
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/eventos")
      .then(res => {
        setEventos(res.data);
        if (res.data.length) {
          setEventoSeleccionado(res.data[0].idEvento);
        }
      })
      .catch(err => console.error("Error al obtener eventos", err));
  }, []);

  // Cuando cambia el evento seleccionado cargo sus resultados
  useEffect(() => {
    if (!eventoSeleccionado) return;
    axios
      .get(`http://localhost:3001/api/resultados/evento/${eventoSeleccionado}`)
      .then(res => setResultados(res.data))
      .catch(err => console.error("Error al obtener resultados", err));
  }, [eventoSeleccionado]);

  const handleDelete = (id) => {
    if (usuario?.perfil !== "cronometrista") return;
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
    if (usuario?.perfil !== "cronometrista") return;
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

      <FormControl sx={{ mb: 2, minWidth: 240 }}>
        <InputLabel id="evento-label">Evento</InputLabel>
        <Select
          labelId="evento-label"
          value={eventoSeleccionado}
          label="Evento"
          onChange={e => setEventoSeleccionado(e.target.value)}
        >
          {eventos.map(ev => (
            <MenuItem key={ev.idEvento} value={ev.idEvento}>
              {ev.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Corredor</TableCell>
            <TableCell>Tiempo</TableCell>
            <TableCell>Pos. General</TableCell>
            <TableCell>Pos. Cat.</TableCell>
            {usuario?.perfil === "cronometrista" && (
              <TableCell>Acciones</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {resultados.map(r => (
            <TableRow key={r.idResultado}>
              <TableCell>{r.nombre} {r.apellido}</TableCell>
              <TableCell>{r.tiempoOficial}</TableCell>
              <TableCell>{r.posicionGeneral}</TableCell>
              <TableCell>{r.posicionCategoria}</TableCell>
              {usuario?.perfil === "cronometrista" && (
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