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
  MenuItem,
  TextField,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Paper,
  Button,
  CircularProgress,
  Divider
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";

const Resultados = () => {
  const { usuario, token } = useContext(AuthContext);
  const [resultados, setResultados] = useState([]);
  const [resultadosFiltrados, setResultadosFiltrados] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    totalParticipantes: 0,
    tiempoPromedio: "",
    categorias: []
  });
  const navigate = useNavigate();

  // Traer eventos
  useEffect(() => {
    setCargando(true);
    axios
      .get("http://localhost:3001/api/eventos")
      .then(res => {
        const eventosActivos = res.data.filter(e => e.estado === "activo" || e.estado === "finalizado");
        setEventos(eventosActivos);
        if (eventosActivos.length) {
          setEventoSeleccionado(eventosActivos[0].idEvento);
        }
      })
      .catch(err => {
        console.error("Error al obtener eventos", err);
        setMensaje("Error al cargar eventos");
      })
      .finally(() => setCargando(false));
  }, []);

  // Cuando cambia el evento seleccionado cargo sus resultados
  useEffect(() => {
    if (!eventoSeleccionado) return;
    
    setCargando(true);
    axios
      .get(`http://localhost:3001/api/resultados/evento/${eventoSeleccionado}`)
      .then(res => {
        setResultados(res.data);
        
        // Extraer categorías únicas
        const categoriasUnicas = [...new Set(res.data.map(r => r.nombreCategoria).filter(Boolean))];
        setCategorias(categoriasUnicas);
        
        // Calcular estadísticas
        calcularEstadisticas(res.data);
      })
      .catch(err => {
        console.error("Error al obtener resultados", err);
        setMensaje("Error al cargar resultados");
      })
      .finally(() => setCargando(false));
  }, [eventoSeleccionado]);

  // Filtrar resultados por categoría y búsqueda
  useEffect(() => {
    let filtrados = [...resultados];

    // Filtro por categoría
    if (categoriaFiltro !== "todas") {
      filtrados = filtrados.filter(r => r.nombreCategoria === categoriaFiltro);
    }

    // Filtro por búsqueda de nombre
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase();
      filtrados = filtrados.filter(r => 
        `${r.nombre} ${r.apellido}`.toLowerCase().includes(busquedaLower)
      );
    }

    setResultadosFiltrados(filtrados);
  }, [resultados, categoriaFiltro, busqueda]);

  const calcularEstadisticas = (datos) => {
    if (!datos.length) {
      setEstadisticas({ totalParticipantes: 0, tiempoPromedio: "", categorias: [] });
      return;
    }

    const total = datos.length;
    
    // Convertir tiempos a segundos para calcular promedio
    const tiemposEnSegundos = datos
      .map(r => convertirTiempoASegundos(r.tiempoOficial))
      .filter(t => t > 0);
    
    const promedioSegundos = tiemposEnSegundos.length 
      ? tiemposEnSegundos.reduce((a, b) => a + b, 0) / tiemposEnSegundos.length
      : 0;
    
    const tiempoPromedio = convertirSegundosATiempo(promedioSegundos);

    // Contar por categoría
    const categoriasCount = {};
    datos.forEach(r => {
      if (r.nombreCategoria) {
        categoriasCount[r.nombreCategoria] = (categoriasCount[r.nombreCategoria] || 0) + 1;
      }
    });

    setEstadisticas({
      totalParticipantes: total,
      tiempoPromedio,
      categorias: Object.entries(categoriasCount).map(([cat, count]) => ({ cat, count }))
    });
  };

  const convertirTiempoASegundos = (tiempo) => {
    if (!tiempo) return 0;
    const partes = tiempo.split(':');
    if (partes.length === 3) {
      return parseInt(partes[0]) * 3600 + parseInt(partes[1]) * 60 + parseInt(partes[2]);
    }
    return 0;
  };

  const convertirSegundosATiempo = (segundos) => {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = Math.floor(segundos % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDelete = (id) => {
    if (usuario?.perfil !== "cronometrista") return;
    if (!window.confirm("¿Eliminar este resultado?")) return;

    axios
      .delete(`http://localhost:3001/api/resultados/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        setResultados(r => r.filter(item => item.idResultado !== id));
        setMensaje("Resultado eliminado correctamente");
        setTimeout(() => setMensaje(""), 3000);
      })
      .catch(() => {
        setMensaje("Error al eliminar resultado");
      });
  };

  const handleEdit = () => {
    if (usuario?.perfil !== "cronometrista") return;
    navigate("/cronometrista");
  };

  const exportarCSV = () => {
    if (!resultadosFiltrados.length) return;

    const eventoNombre = eventos.find(e => e.idEvento === eventoSeleccionado)?.nombre || "evento";
    const headers = ["Posición General", "Corredor", "Categoría", "Tiempo Oficial", "Posición Categoría"];
    const rows = resultadosFiltrados.map(r => [
      r.posicionGeneral,
      `${r.nombre} ${r.apellido}`,
      r.nombreCategoria || "Sin categoría",
      r.tiempoOficial,
      r.posicionCategoria || "N/A"
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach(row => {
      csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resultados_${eventoNombre.replace(/\s/g, '_')}.csv`;
    a.click();
  };

  const podio = resultadosFiltrados.slice(0, 3);

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Resultados Oficiales
      </Typography>

      {mensaje && (
        <Alert
          severity={mensaje.includes("Error") ? "error" : "success"}
          sx={{ mb: 2 }}
          onClose={() => setMensaje("")}
        >
          {mensaje}
        </Alert>
      )}

      {/* Filtros */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="evento-label">Evento</InputLabel>
              <Select
                labelId="evento-label"
                value={eventoSeleccionado}
                label="Evento"
                onChange={e => setEventoSeleccionado(e.target.value)}
              >
                {eventos.map(ev => (
                  <MenuItem key={ev.idEvento} value={ev.idEvento}>
                    {ev.nombre} - {new Date(ev.fecha).toLocaleDateString()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="categoria-label">Categoría</InputLabel>
              <Select
                labelId="categoria-label"
                value={categoriaFiltro}
                label="Categoría"
                onChange={e => setCategoriaFiltro(e.target.value)}
              >
                <MenuItem value="todas">Todas las categorías</MenuItem>
                {categorias.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar corredor"
              variant="outlined"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />
              }}
            />
          </Grid>

          {usuario?.perfil === "cronometrista" && (
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={exportarCSV}
                disabled={!resultadosFiltrados.length}
              >
                CSV
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>

      {cargando ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Estadísticas */}
          {resultados.length > 0 && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Total participantes
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      {estadisticas.totalParticipantes}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Tiempo promedio
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      {estadisticas.tiempoPromedio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Categorías
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      {categorias.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Podio */}
          {podio.length > 0 && categoriaFiltro === "todas" && !busqueda && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                🏆 Podio General
              </Typography>
              <Grid container spacing={2}>
                {podio.map((corredor, index) => (
                  <Grid item xs={12} md={4} key={corredor.idResultado}>
                    <Card 
                      elevation={3}
                      sx={{
                        border: index === 0 ? "3px solid gold" : index === 1 ? "3px solid silver" : "3px solid #CD7F32",
                        position: "relative"
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                          <Chip
                            icon={<EmojiEventsIcon />}
                            label={`#${index + 1}`}
                            color={index === 0 ? "warning" : index === 1 ? "default" : "error"}
                            sx={{ fontWeight: "bold" }}
                          />
                          <Typography variant="h4">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {corredor.nombre} {corredor.apellido}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Categoría: {corredor.nombreCategoria || "Sin categoría"}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
                          {corredor.tiempoOficial}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Tabla de Resultados */}
          {resultadosFiltrados.length > 0 ? (
            <Paper elevation={2} sx={{ overflow: "hidden" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "primary.main" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Pos.</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Corredor</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Categoría</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tiempo</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Pos. Cat.</TableCell>
                    {usuario?.perfil === "cronometrista" && (
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Acciones</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resultadosFiltrados.map((r, index) => (
                    <TableRow 
                      key={r.idResultado}
                      sx={{
                        "&:hover": { backgroundColor: "action.hover" },
                        backgroundColor: index < 3 && categoriaFiltro === "todas" && !busqueda 
                          ? "action.selected" 
                          : "inherit"
                      }}
                    >
                      <TableCell sx={{ fontWeight: "bold" }}>{r.posicionGeneral}</TableCell>
                      <TableCell>{r.nombre} {r.apellido}</TableCell>
                      <TableCell>
                        <Chip 
                          label={r.nombreCategoria || "Sin categoría"} 
                          size="small" 
                          color={r.nombreCategoria ? "primary" : "default"}
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "primary.main" }}>
                        {r.tiempoOficial}
                      </TableCell>
                      <TableCell>{r.posicionCategoria || "N/A"}</TableCell>
                      {usuario?.perfil === "cronometrista" && (
                        <TableCell>
                          <IconButton 
                            onClick={() => handleEdit(r.idResultado)}
                            size="small"
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDelete(r.idResultado)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ) : (
            <Paper elevation={2} sx={{ p: 5, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                {resultados.length === 0 
                  ? "No hay resultados disponibles para este evento"
                  : "No se encontraron resultados con los filtros aplicados"
                }
              </Typography>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default Resultados;