import { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Paper,
  Divider
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";

const MisInscripciones = () => {
  const { usuario, token } = useContext(AuthContext);
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (usuario?.id && token) {
      fetchInscripciones();
    }
  }, [usuario, token]);

  const fetchInscripciones = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/inscripciones/usuario/${usuario.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInscripciones(res.data);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener inscripciones", error);
      setMensaje("Error al cargar tus inscripciones");
      setCargando(false);
    }
  };

  if (!usuario) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Debes iniciar sesión para ver tus inscripciones
        </Alert>
      </Container>
    );
  }

  if (cargando) {
    return (
      <Container sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Mis Inscripciones
      </Typography>

      {mensaje && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {mensaje}
        </Alert>
      )}

      {inscripciones.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No tienes inscripciones aún
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Ve a la página de Inscripciones para registrarte en un evento
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {inscripciones.map((inscripcion) => (
            <Grid item xs={12} md={6} key={inscripcion.idInscripcion}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Título del evento */}
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "primary.main" }}
                  >
                    {inscripcion.nombreEvento}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Información del evento */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    <EventIcon sx={{ mr: 1, color: "action.active" }} />
                    <Typography variant="body2" color="text.secondary">
                      <strong>Fecha:</strong>{" "}
                      {new Date(inscripcion.fecha).toLocaleDateString("es-AR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    <LocationOnIcon sx={{ mr: 1, color: "action.active" }} />
                    <Typography variant="body2" color="text.secondary">
                      <strong>Lugar:</strong> {inscripcion.lugar}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CategoryIcon sx={{ mr: 1, color: "action.active" }} />
                    <Typography variant="body2" color="text.secondary">
                      <strong>Categoría:</strong>{" "}
                      {inscripcion.nombreCategoria || "Sin categoría"}
                    </Typography>
                  </Box>

                  {/* Estados */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      mt: 2,
                    }}
                  >
                    {/* Estado del evento */}
                    <Chip
                      label={inscripcion.estadoEvento || "Activo"}
                      color={
                        inscripcion.estadoEvento === "activo"
                          ? "success"
                          : inscripcion.estadoEvento === "finalizado"
                          ? "default"
                          : "warning"
                      }
                      size="small"
                      icon={
                        inscripcion.estadoEvento === "activo" ? (
                          <CheckCircleIcon />
                        ) : (
                          <PendingIcon />
                        )
                      }
                    />

                    {/* Estado del pago */}
                    <Chip
                      label={
                        inscripcion.estadoPago === "aprobado"
                          ? "Pago Aprobado"
                          : inscripcion.estadoPago === "pendiente"
                          ? "Pago Pendiente"
                          : "Pago Rechazado"
                      }
                      color={
                        inscripcion.estadoPago === "aprobado"
                          ? "success"
                          : inscripcion.estadoPago === "pendiente"
                          ? "warning"
                          : "error"
                      }
                      size="small"
                    />

                    {/* Método de pago */}
                    {inscripcion.metodoPago && (
                      <Chip
                        label={
                          inscripcion.metodoPago === "MercadoPago"
                            ? "Mercado Pago"
                            : inscripcion.metodoPago
                        }
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Resumen */}
      {inscripciones.length > 0 && (
        <Paper elevation={2} sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Resumen
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
                  {inscripciones.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de inscripciones
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "success.main" }}>
                  {inscripciones.filter((i) => i.estadoPago === "aprobado").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pagos aprobados
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "warning.main" }}>
                  {inscripciones.filter((i) => i.estadoPago === "pendiente").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pagos pendientes
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default MisInscripciones;