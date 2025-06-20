import { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Box
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Inscripciones = () => {
  const { usuario, token } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    idEvento: null,
    categoria: "",
    metodoPago: ""
  });
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Traer todos los eventos
    axios
      .get("http://localhost:3001/api/eventos")
      .then(res => setEventos(res.data))
      .catch(console.error);

    // Traer mis inscripciones solo si hay usuario y token
    if (usuario && token) {
      axios
        .get("http://localhost:3001/api/inscripciones", {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res =>
          setInscripciones(
            res.data.filter(i => i.idUsuario === usuario.id)
          )
        )
        .catch(console.error);
    }
  }, [token, usuario.id]);

  const handleOpen = evento => {
    if (!usuario || !token) {
      navigate("/login");
      return;
    }
    setForm({ idEvento: evento.idEvento, categoria: "", metodoPago: "" });
    setOpen(true);
    setMensaje("");
  };
  const handleClose = () => setOpen(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!usuario || !token) {
      navigate("/login");
      return;
    }
    axios
      .post(
        "http://localhost:3001/api/inscripciones",
        {
          idUsuario: usuario.id,
          idEvento: form.idEvento,
          categoria: form.categoria,
          metodoPago: form.metodoPago
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        setMensaje("Inscripción creada con éxito");
        setOpen(false);

        // Refrescar inscripciones desde el backend
        axios
          .get("http://localhost:3001/api/inscripciones", {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(res =>
            setInscripciones(res.data.filter(i => i.idUsuario === usuario.idUsuario))
          )
          .catch(console.error);
      })
      .catch(err => {
        console.error(err);
        setMensaje("Error al crear inscripción");
      });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inscripciones
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
            <TableCell>Nombre</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Lugar</TableCell>
            <TableCell>Acción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {eventos.map(evt => {
            const yaInscripto = inscripciones.some(
              ins => ins.idEvento === evt.idEvento
            );
            return (
              <TableRow key={evt.idEvento}>
                <TableCell>{evt.nombre}</TableCell>
                <TableCell>{evt.fecha}</TableCell>
                <TableCell>{evt.lugar}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleOpen(evt)}
                    disabled={yaInscripto}
                  >
                    {yaInscripto ? "Inscripto" : "Inscribirse"}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Formulario de Inscripción</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Categoría"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Método de Pago"
              name="metodoPago"
              value={form.metodoPago}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Enviar</Button>
        </DialogActions>
      </Dialog>

      {usuario && token && (
        <>
          <Typography variant="h5" sx={{ mt: 4 }}>
            Mis Inscripciones
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Evento</TableCell>
                <TableCell>Estado de Pago</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inscripciones.map(ins => (
                <TableRow key={ins.idInscripcion}>
                  <TableCell>
                    {eventos.find(e => e.idEvento === ins.idEvento)?.nombre}
                  </TableCell>
                  <TableCell>{ins.estadoPago}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default Inscripciones;