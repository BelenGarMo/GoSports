import { useState, useContext, useEffect } from "react";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  Alert,
  InputLabel,
  FormControl
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const PanelCronometrista = () => {
  const { usuario, token } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [form, setForm] = useState({
    idEvento: "",
    tiempoOficial: "",
    posicionGeneral: "",
    posicionCategoria: ""
  });
  const [mensaje, setMensaje] = useState("");

  // Sólo cronometristas
  if (usuario?.perfil !== "cronometrista") {
    return <Alert severity="error">Acceso restringido a cronometristas</Alert>;
  }

  // Cargo los eventos para poblar el select
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/eventos", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setEventos(res.data))
      .catch(err => console.error("Error al traer eventos", err));
  }, [token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Construyo payload con las columnas que espera la DB
      const payload = {
        idEvento: form.idEvento,
        idUsuario: usuario.id,
        tiempoOficial: form.tiempoOficial,
        posicionGeneral: form.posicionGeneral,
        posicionCategoria: form.posicionCategoria
      };

      await axios.post("http://localhost:3001/api/resultados", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensaje("Resultado cargado con éxito");
      setForm({ idEvento: "", tiempoOficial: "", posicionGeneral: "", posicionCategoria: "" });
    } catch (error) {
      console.error("Error al guardar resultado", error);
      setMensaje("Error al cargar el resultado");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel del Cronometrista
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
      >
        <FormControl fullWidth>
          <InputLabel id="label-evento">Evento</InputLabel>
          <Select
            labelId="label-evento"
            name="idEvento"
            value={form.idEvento}
            label="Evento"
            onChange={handleChange}
            required
          >
            {eventos.map(evt => (
              <MenuItem key={evt.idEvento} value={evt.idEvento}>
                {evt.nombre} — {new Date(evt.fecha).toLocaleDateString()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          name="tiempoOficial"
          label="Tiempo oficial"
          value={form.tiempoOficial}
          onChange={handleChange}
          required
        />
        <TextField
          name="posicionGeneral"
          label="Posición general"
          type="number"
          value={form.posicionGeneral}
          onChange={handleChange}
          required
        />
        <TextField
          name="posicionCategoria"
          label="Posición categoría"
          type="number"
          value={form.posicionCategoria}
          onChange={handleChange}
          required
        />

        <Button type="submit" variant="contained">
          Cargar Resultado
        </Button>
        {mensaje && <Alert severity={mensaje.includes("éxito") ? "success" : "error"}>{mensaje}</Alert>}
      </Box>
    </Container>
  );
};

export default PanelCronometrista;