import { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Autocomplete,
  Chip,
  Grid,
  Card,
  CardContent
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";

const PanelCronometrista = () => {
  const { usuario, token } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [inscritos, setInscritos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("");
  const [corredorSeleccionado, setCorredorSeleccionado] = useState(null);
  const [tiempoOficial, setTiempoOficial] = useState("");
  const [posicionGeneral, setPosicionGeneral] = useState("");
  const [posicionCategoria, setPosicionCategoria] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [exito, setExito] = useState(false);

  // Categoría se obtiene automáticamente del corredor
  const categoriaDelCorredor = corredorSeleccionado?.idCategoria;
  const nombreCategoria = corredorSeleccionado?.nombreCategoria;

  // Solo acceso para cronometristas
  if (usuario?.perfil !== "cronometrista") {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Acceso restringido a cronometristas
        </Alert>
      </Container>
    );
  }

  useEffect(() => {
    fetchEventos();
  }, [token]);

  useEffect(() => {
    if (eventoSeleccionado) {
      fetchInscritos(eventoSeleccionado);
    } else {
      setInscritos([]);
    }
  }, [eventoSeleccionado]);

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

  const fetchInscritos = async (idEvento) => {
    try {
      // Endpoint que trae inscriptos con su categoría
      const res = await axios.get(
        `http://localhost:3001/api/inscripciones/evento/${idEvento}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInscritos(res.data);
    } catch (error) {
      console.error("Error al obtener inscritos", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventoSeleccionado || !corredorSeleccionado) {
      setMensaje("Por favor completa todos los campos obligatorios");
      setExito(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:3001/api/resultados",
        {
          idEvento: eventoSeleccionado,
          idUsuario: corredorSeleccionado.idUsuario || corredorSeleccionado.id,
          idCategoria: categoriaDelCorredor,
          tiempoOficial,
          posicionGeneral: posicionGeneral || null,
          posicionCategoria: posicionCategoria || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje("Resultado registrado correctamente");
      setExito(true);

      // Limpiar formulario
      setCorredorSeleccionado(null);
      setTiempoOficial("");
      setPosicionGeneral("");
      setPosicionCategoria("");

      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al registrar resultado", error);
      setMensaje(error.response?.data?.mensaje || "Error al registrar resultado");
      setExito(false);
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Panel del cronometrista
      </Typography>

      {mensaje && (
        <Alert
          severity={exito ? "success" : "error"}
          sx={{ mb: 3 }}
          onClose={() => setMensaje("")}
        >
          {mensaje}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* FORMULARIO */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Cargar tiempo de corredor
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Evento</InputLabel>
                <Select
                  value={eventoSeleccionado}
                  label="Evento"
                  onChange={(e) => {
                    setEventoSeleccionado(e.target.value);
                    setCorredorSeleccionado(null);
                  }}
                  required
                >
                  <MenuItem value="">
                    <em>Selecciona un evento</em>
                  </MenuItem>
                  {eventos.map((ev) => (
                    <MenuItem key={ev.idEvento} value={ev.idEvento}>
                      {ev.nombre} - {new Date(ev.fecha).toLocaleDateString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {eventoSeleccionado && inscritos.length === 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  No hay corredores inscriptos en este evento
                </Alert>
              )}

              {eventoSeleccionado && inscritos.length > 0 && (
                <>
                  <Autocomplete
                    value={corredorSeleccionado}
                    onChange={(event, newValue) => {
                      setCorredorSeleccionado(newValue);
                    }}
                    options={inscritos}
                    getOptionLabel={(option) =>
                      `${option.nombre} ${option.apellido} - ${option.nombreCategoria || "Sin categoría"}`
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Corredor"
                        required
                        placeholder="Buscar corredor..."
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box>
                          <Typography variant="body1">
                            <PersonIcon sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }} />
                            {option.nombre} {option.apellido}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            <CategoryIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
                            {option.nombreCategoria || "Sin categoría"}
                          </Typography>
                        </Box>
                      </li>
                    )}
                    sx={{ mb: 3 }}
                    noOptionsText="No se encontraron corredores"
                  />

                  {corredorSeleccionado && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                      <strong>Categoría asignada:</strong> {nombreCategoria || "Sin categoría"}
                      <br />
                      <Typography variant="caption">
                        La categoría se asigna automáticamente según la inscripción del corredor
                      </Typography>
                    </Alert>
                  )}

                  <TextField
                    label="Tiempo Oficial"
                    value={tiempoOficial}
                    onChange={(e) => setTiempoOficial(e.target.value)}
                    fullWidth
                    required
                    placeholder="HH:MM:SS (ej: 01:25:30)"
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: <AccessTimeIcon sx={{ mr: 1, color: "action.active" }} />
                    }}
                  />

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Posición General"
                        type="number"
                        value={posicionGeneral}
                        onChange={(e) => setPosicionGeneral(e.target.value)}
                        fullWidth
                        placeholder="Ej: 1, 2, 3..."
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Posición en Categoría"
                        type="number"
                        value={posicionCategoria}
                        onChange={(e) => setPosicionCategoria(e.target.value)}
                        fullWidth
                        placeholder="Ej: 1, 2, 3..."
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                  >
                    Registrar tiempo
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* PANEL DE INFORMACIÓN */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Información
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Registra los tiempos de los corredores. La categoría se asigna automáticamente según su inscripción.
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                Formato de tiempo:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • HH:MM:SS (Ej: 01:25:30)
                <br />
                • MM:SS (Ej: 45:30)
              </Typography>
            </CardContent>
          </Card>

          {eventoSeleccionado && inscritos.length > 0 && (
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Estadísticas del evento
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total de inscriptos
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {inscritos.length}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Categorías
                  </Typography>
                  {[...new Set(inscritos.map(i => i.nombreCategoria))].map((cat, idx) => (
                    <Chip
                      key={idx}
                      label={`${cat}: ${inscritos.filter(i => i.nombreCategoria === cat).length}`}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PanelCronometrista;