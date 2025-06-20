import { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const PanelOrganizador = () => {
  const { usuario, token } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    lugar: "",
    estado: "activo"
  });
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // Solo acceso para organizadores
  if (usuario?.perfil !== "organizador") {
    return <Alert severity="error">Acceso restringido a organizadores</Alert>;
  }

  // Traer eventos
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/eventos", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEventos(res.data);
      } catch (error) {
        console.error("Error al obtener eventos", error);
      }
    };
    fetchEventos();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(
          `http://localhost:3001/api/eventos/${editando}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMensaje("Evento actualizado con éxito");
      } else {
        await axios.post(
          "http://localhost:3001/api/eventos",
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMensaje("Evento creado con éxito");
      }

      // Reset form y refrescar lista
      setForm({ nombre: "", descripcion: "", fecha: "", lugar: "", estado: "activo" });
      setEditando(null);
      const res = await axios.get("http://localhost:3001/api/eventos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEventos(res.data);
    } catch (error) {
      console.error("Error al guardar evento", error);
      setMensaje("Error al guardar evento");
    }
  };

  const handleEditar = (evento) => {
    setForm({
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      fecha: evento.fecha,
      lugar: evento.lugar,
      estado: evento.estado
    });
    setEditando(evento.idEvento);
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/eventos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEventos(eventos.filter((ev) => ev.idEvento !== id));
    } catch (error) {
      console.error("Error al eliminar evento", error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel del Organizador
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 600 }}
      >
        <TextField
          name="nombre"
          label="Nombre del evento"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <TextField
          name="descripcion"
          label="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          required
        />
        <TextField
          name="fecha"
          label="Fecha (YYYY-MM-DD)"
          value={form.fecha}
          onChange={handleChange}
          required
        />
        <TextField
          name="lugar"
          label="Lugar"
          value={form.lugar}
          onChange={handleChange}
          required
        />
        <TextField
          name="estado"
          label="Estado (activo/finalizado/cancelado)"
          value={form.estado}
          onChange={handleChange}
          required
        />
        <Button variant="contained" type="submit">
          {editando ? "Actualizar" : "Crear"}
        </Button>
        {mensaje && (
          <Alert severity={mensaje.includes("éxito") ? "success" : "error"}>
            {mensaje}
          </Alert>
        )}
      </Box>

      <Typography variant="h6" sx={{ mt: 4 }}>
        Mis eventos
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Lugar</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {eventos.map((ev) => (
            <TableRow key={ev.idEvento}>
              <TableCell>{ev.nombre}</TableCell>
              <TableCell>{ev.fecha}</TableCell>
              <TableCell>{ev.lugar}</TableCell>
              <TableCell>{ev.estado}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditar(ev)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleEliminar(ev.idEvento)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default PanelOrganizador;