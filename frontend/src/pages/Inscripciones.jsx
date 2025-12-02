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
  Card,
  CardContent,
  Grid,
  Chip,
  Divider
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CategoryIcon from "@mui/icons-material/Category";
import InfoIcon from "@mui/icons-material/Info";

const Inscripciones = () => {
  const { usuario, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [metodoPago, setMetodoPago] = useState("transferencia");
  const [mensaje, setMensaje] = useState("");
  const [exito, setExito] = useState(false);
  const [yaInscrito, setYaInscrito] = useState(false);

  // Solo acceso para corredores
  if (usuario?.perfil !== "corredor") {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Acceso restringido a corredores. Por favor inicia sesión como corredor.
        </Alert>
      </Container>
    );
  }

  useEffect(() => {
    fetchEventos();
  }, [token]);

  useEffect(() => {
    if (eventoSeleccionado) {
      fetchCategorias(eventoSeleccionado);
      verificarInscripcion(eventoSeleccionado);
    } else {
      setCategorias([]);
      setCategoriaSeleccionada("");
      setYaInscrito(false);
    }
  }, [eventoSeleccionado]);

  const fetchEventos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/eventos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Solo mostrar eventos activos
      const eventosActivos = res.data.filter(ev => ev.estado === "activo");
      setEventos(eventosActivos);
    } catch (error) {
      console.error("Error al obtener eventos", error);
      setMensaje("Error al cargar eventos");
    }
  };

  const fetchCategorias = async (idEvento) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/categorias/evento/${idEvento}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategorias(res.data);
      
      // Autoseleccionar categoría si solo hay una
      if (res.data.length === 1) {
        setCategoriaSeleccionada(res.data[0].idCategoria);
      }
    } catch (error) {
      console.error("Error al obtener categorías", error);
    }
  };

  const verificarInscripcion = async (idEvento) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/inscripciones/verificar/${idEvento}/${usuario.idUsuario}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setYaInscrito(res.data.inscrito);
    } catch (error) {
      console.error("Error al verificar inscripción", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventoSeleccionado) {
      setMensaje("Por favor selecciona un evento");
      return;
    }

    if (!categoriaSeleccionada) {
      setMensaje("Por favor selecciona una categoría");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3001/api/inscripciones",
        {
          idEvento: eventoSeleccionado,
          idUsuario: usuario.id,
          idCategoria: categoriaSeleccionada,
          metodoPago: metodoPago,
          estado: "confirmado"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje("¡Inscripción exitosa!");
      setExito(true);
      setYaInscrito(true);
      
      setTimeout(() => {
        navigate("/mis-inscripciones");
      }, 2000);
    } catch (error) {
      console.error("Error al inscribirse", error);
      setMensaje(error.response?.data?.mensaje || "Error al inscribirse");
      setExito(false);
    }
  };

  const eventoActual = eventos.find(e => e.idEvento === parseInt(eventoSeleccionado));
  const categoriaActual = categorias.find(c => c.idCategoria === parseInt(categoriaSeleccionada));

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Inscripción a Eventos
      </Typography>

      {mensaje && (
        <Alert
          severity={exito ? "success" : "error"}
          sx={{ mb: 3 }}
          onClose={() => setMensaje("")}
          icon={exito ? <CheckCircleIcon /> : undefined}
        >
          {mensaje}
        </Alert>
      )}

      <Grid container spacing={3}>
        {}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Completa tu inscripción
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Evento</InputLabel>
                <Select
                  value={eventoSeleccionado}
                  label="Evento"
                  onChange={(e) => setEventoSeleccionado(e.target.value)}
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

              {eventoSeleccionado && (
                <>
                  {categorias.length === 0 ? (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                      Este evento aún no tiene categorías disponibles. Contacta al organizador.
                    </Alert>
                  ) : (
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Categoría</InputLabel>
                      <Select
                        value={categoriaSeleccionada}
                        label="Categoría"
                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                        required
                        disabled={yaInscrito}
                      >
                        <MenuItem value="">
                          <em>Selecciona tu categoría</em>
                        </MenuItem>
                        {categorias.map((cat) => (
                          <MenuItem key={cat.idCategoria} value={cat.idCategoria}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CategoryIcon fontSize="small" />
                              <span>{cat.nombreCategoria}</span>
                              {cat.edadMinima && cat.edadMaxima && (
                                <Chip
                                  label={`${cat.edadMinima}-${cat.edadMaxima} años`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                              <Chip
                                label={cat.genero}
                                size="small"
                                color={
                                  cat.genero === "masculino"
                                    ? "primary"
                                    : cat.genero === "femenino"
                                    ? "secondary"
                                    : "default"
                                }
                              />
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {categoriaActual && (
                    <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
                      <strong>Categoría seleccionada:</strong> {categoriaActual.nombreCategoria}
                      {categoriaActual.descripcion && (
                        <Box sx={{ mt: 1 }}>{categoriaActual.descripcion}</Box>
                      )}
                    </Alert>
                  )}

                  {}
                  {categoriaSeleccionada && (
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Método de Pago</InputLabel>
                      <Select
                        value={metodoPago}
                        label="Método de Pago"
                        onChange={(e) => setMetodoPago(e.target.value)}
                        required
                      >
                        <MenuItem value="transferencia">
                          💳 Transferencia Bancaria
                        </MenuItem>
                        <MenuItem value="MercadoPago">
                          💰 Mercado Pago
                        </MenuItem>
                        <MenuItem value="efectivo">
                          💵 Efectivo (en el evento)
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}

                  {yaInscrito ? (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Ya estás inscripto en este evento
                    </Alert>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={!categoriaSeleccionada || categorias.length === 0}
                    >
                      Confirmar inscripción
                    </Button>
                  )}
                </>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* INFORMACIÓN DEL EVENTO */}
        <Grid item xs={12} md={5}>
          {eventoActual && (
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Información del evento
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Evento
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {eventoActual.nombre}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha
                  </Typography>
                  <Typography variant="body1">
                    {new Date(eventoActual.fecha).toLocaleDateString("es-AR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Lugar
                  </Typography>
                  <Typography variant="body1">{eventoActual.lugar}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Descripción
                  </Typography>
                  <Typography variant="body2">{eventoActual.descripcion}</Typography>
                </Box>

                {categorias.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Categorías disponibles ({categorias.length})
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {categorias.map((cat) => (
                        <Chip
                          key={cat.idCategoria}
                          label={cat.nombreCategoria}
                          size="small"
                          color={
                            cat.idCategoria === parseInt(categoriaSeleccionada)
                              ? "primary"
                              : "default"
                          }
                          variant={
                            cat.idCategoria === parseInt(categoriaSeleccionada)
                              ? "filled"
                              : "outlined"
                          }
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {!eventoActual && (
            <Card elevation={3}>
              <CardContent>
                <Typography variant="body1" color="text.secondary" align="center">
                  Selecciona un evento para ver más información
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Inscripciones;