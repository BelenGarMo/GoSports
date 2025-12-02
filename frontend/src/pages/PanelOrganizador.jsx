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
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";

const PanelOrganizador = () => {
  const { usuario, token } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  
  // Formulario de evento
  const [formEvento, setFormEvento] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    lugar: "",
    estado: "activo"
  });
  
  // Formulario de categoría
  const [formCategoria, setFormCategoria] = useState({
    nombreCategoria: "",
    edadMinima: "",
    edadMaxima: "",
    genero: "mixto",
    descripcion: ""
  });
  
  const [editandoEvento, setEditandoEvento] = useState(null);
  const [editandoCategoria, setEditandoCategoria] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [openDialogCategoria, setOpenDialogCategoria] = useState(false);

  // Solo acceso para organizadores
  if (usuario?.perfil !== "organizador") {
    return <Alert severity="error">Acceso restringido a organizadores</Alert>;
  }

  // Traer eventos
  useEffect(() => {
    fetchEventos();
  }, [token]);

  // Traer categorías cuando se selecciona un evento
  useEffect(() => {
    if (eventoSeleccionado) {
      fetchCategorias(eventoSeleccionado);
    }
  }, [eventoSeleccionado]);

  const fetchEventos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/eventos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEventos(res.data);
      if (res.data.length > 0 && !eventoSeleccionado) {
        setEventoSeleccionado(res.data[0].idEvento);
      }
    } catch (error) {
      console.error("Error al obtener eventos", error);
    }
  };

  const fetchCategorias = async (idEvento) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/categorias/evento/${idEvento}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategorias(res.data);
    } catch (error) {
      console.error("Error al obtener categorías", error);
    }
  };

  // ============= EVENTOS =============
  const handleChangeEvento = (e) => {
    setFormEvento({ ...formEvento, [e.target.name]: e.target.value });
  };

  const handleSubmitEvento = async (e) => {
    e.preventDefault();
    try {
      // ✅ AGREGAR el idCreador del organizador
      const eventoData = {
        ...formEvento,
        idCreador: usuario.id
      };

      if (editandoEvento) {
        await axios.put(
          `http://localhost:3001/api/eventos/${editandoEvento}`,
          eventoData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMensaje("Evento actualizado con éxito");
      } else {
        const res = await axios.post(
          "http://localhost:3001/api/eventos",
          eventoData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMensaje("Evento creado con éxito");
        setEventoSeleccionado(res.data.id);
      }

      setFormEvento({ 
        nombre: "", 
        descripcion: "", 
        fecha: "", 
        lugar: "", 
        estado: "activo" 
      });
      setEditandoEvento(null);
      fetchEventos();
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al guardar evento", error);
      setMensaje("Error al guardar evento");
    }
  };

  const handleEditarEvento = (evento) => {
    setFormEvento({
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      fecha: evento.fecha.split('T')[0],
      lugar: evento.lugar,
      estado: evento.estado
    });
    setEditandoEvento(evento.idEvento);
    setTabValue(0);
  };

  const handleEliminarEvento = async (id) => {
    if (!window.confirm("¿Eliminar este evento y todas sus categorías?")) return;
    
    try {
      await axios.delete(`http://localhost:3001/api/eventos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEventos(eventos.filter((ev) => ev.idEvento !== id));
      if (eventoSeleccionado === id) {
        setEventoSeleccionado(eventos[0]?.idEvento || null);
      }
      setMensaje("Evento eliminado correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al eliminar evento", error);
      setMensaje("Error al eliminar evento");
    }
  };

  // ============= CATEGORÍAS =============
  const handleChangeCategoria = (e) => {
    setFormCategoria({ ...formCategoria, [e.target.name]: e.target.value });
  };

  const handleOpenDialogCategoria = (categoria = null) => {
    if (categoria) {
      setFormCategoria({
        nombreCategoria: categoria.nombreCategoria,
        edadMinima: categoria.edadMinima || "",
        edadMaxima: categoria.edadMaxima || "",
        genero: categoria.genero || "mixto",
        descripcion: categoria.descripcion || ""
      });
      setEditandoCategoria(categoria.idCategoria);
    } else {
      setFormCategoria({
        nombreCategoria: "",
        edadMinima: "",
        edadMaxima: "",
        genero: "mixto",
        descripcion: ""
      });
      setEditandoCategoria(null);
    }
    setOpenDialogCategoria(true);
  };

  const handleCloseDialogCategoria = () => {
    setOpenDialogCategoria(false);
    setFormCategoria({
      nombreCategoria: "",
      edadMinima: "",
      edadMaxima: "",
      genero: "mixto",
      descripcion: ""
    });
    setEditandoCategoria(null);
  };

  const handleSubmitCategoria = async () => {
    if (!eventoSeleccionado) {
      setMensaje("Primero debes seleccionar un evento");
      return;
    }

    try {
      const payload = {
        ...formCategoria,
        idEvento: eventoSeleccionado,
        edadMinima: formCategoria.edadMinima || null,
        edadMaxima: formCategoria.edadMaxima || null
      };

      if (editandoCategoria) {
        await axios.put(
          `http://localhost:3001/api/categorias/${editandoCategoria}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMensaje("Categoría actualizada con éxito");
      } else {
        await axios.post(
          "http://localhost:3001/api/categorias",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMensaje("Categoría creada con éxito");
      }

      handleCloseDialogCategoria();
      fetchCategorias(eventoSeleccionado);
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al guardar categoría", error);
      setMensaje("Error al guardar categoría");
    }
  };

  const handleEliminarCategoria = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/categorias/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategorias(categorias.filter((cat) => cat.idCategoria !== id));
      setMensaje("Categoría eliminada correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al eliminar categoría", error);
      setMensaje("Error al eliminar categoría");
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Panel del Organizador
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

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="📅 Gestión de Eventos" />
          <Tab label="📂 Categorías" />
          <Tab label="👥 Inscriptos" />
        </Tabs>
      </Box>

      {/* TAB 1: GESTIÓN DE EVENTOS */}
      {tabValue === 0 && (
        <Box>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {editandoEvento ? "Editar Evento" : "Crear Nuevo Evento"}
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmitEvento}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                name="nombre"
                label="Nombre del evento"
                value={formEvento.nombre}
                onChange={handleChangeEvento}
                required
                fullWidth
              />
              <TextField
                name="descripcion"
                label="Descripción"
                value={formEvento.descripcion}
                onChange={handleChangeEvento}
                required
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                name="fecha"
                label="Fecha"
                type="date"
                value={formEvento.fecha}
                onChange={handleChangeEvento}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="lugar"
                label="Lugar"
                value={formEvento.lugar}
                onChange={handleChangeEvento}
                required
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={formEvento.estado}
                  label="Estado"
                  onChange={handleChangeEvento}
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="finalizado">Finalizado</MenuItem>
                  <MenuItem value="cancelado">Cancelado</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="contained" type="submit" fullWidth>
                  {editandoEvento ? "Actualizar" : "Crear Evento"}
                </Button>
                {editandoEvento && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditandoEvento(null);
                      setFormEvento({
                        nombre: "",
                        descripcion: "",
                        fecha: "",
                        lugar: "",
                        estado: "activo"
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Mis Eventos
          </Typography>
          <Paper elevation={2}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "primary.main" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Nombre
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Fecha
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Lugar
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eventos.map((ev) => (
                  <TableRow key={ev.idEvento} hover>
                    <TableCell>{ev.nombre}</TableCell>
                    <TableCell>
                      {new Date(ev.fecha).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{ev.lugar}</TableCell>
                    <TableCell>
                      <Chip
                        label={ev.estado}
                        color={
                          ev.estado === "activo"
                            ? "success"
                            : ev.estado === "finalizado"
                            ? "default"
                            : "error"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEditarEvento(ev)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleEliminarEvento(ev.idEvento)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}

      {/* TAB 2: CATEGORÍAS */}
      {tabValue === 1 && (
        <Box>
          {eventos.length === 0 ? (
            <Alert severity="info">
              Primero debes crear un evento para agregar categorías
            </Alert>
          ) : (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <FormControl sx={{ minWidth: 300 }}>
                  <InputLabel>Evento</InputLabel>
                  <Select
                    value={eventoSeleccionado || ""}
                    label="Evento"
                    onChange={(e) => setEventoSeleccionado(e.target.value)}
                  >
                    {eventos.map((ev) => (
                      <MenuItem key={ev.idEvento} value={ev.idEvento}>
                        {ev.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialogCategoria()}
                >
                  Agregar categoría
                </Button>
              </Box>

              {categorias.length === 0 ? (
                <Alert severity="info" icon={<CategoryIcon />}>
                  No hay categorías para este evento. Hacé clic en "Agregar categoría" para crear una.
                </Alert>
              ) : (
                <Paper elevation={2}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "primary.main" }}>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Nombre
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Edad
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Género
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Descripción
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Acciones
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categorias.map((cat) => (
                        <TableRow key={cat.idCategoria} hover>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            {cat.nombreCategoria}
                          </TableCell>
                          <TableCell>
                            {cat.edadMinima && cat.edadMaxima
                              ? `${cat.edadMinima} - ${cat.edadMaxima} años`
                              : cat.edadMinima
                              ? `${cat.edadMinima}+ años`
                              : "Sin límite"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={cat.genero}
                              color={
                                cat.genero === "masculino"
                                  ? "primary"
                                  : cat.genero === "femenino"
                                  ? "secondary"
                                  : "default"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{cat.descripcion || "-"}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleOpenDialogCategoria(cat)}
                              color="primary"
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                handleEliminarCategoria(cat.idCategoria)
                              }
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              )}
            </>
          )}
        </Box>
      )}

      {/* TAB 3: INSCRIPTOS */}
      {tabValue === 2 && (
        <Alert severity="info">
          Próximamente: Lista de inscriptos al evento seleccionado
        </Alert>
      )}

      {/* DIALOG PARA CREAR/EDITAR CATEGORÍA */}
      <Dialog open={openDialogCategoria} onClose={handleCloseDialogCategoria} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editandoCategoria ? "Editar Categoría" : "Nueva Categoría"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              name="nombreCategoria"
              label="Nombre de la Categoría"
              value={formCategoria.nombreCategoria}
              onChange={handleChangeCategoria}
              required
              fullWidth
              placeholder="Ej: Elite Masculino, Master +40, etc."
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                name="edadMinima"
                label="Edad Mínima"
                type="number"
                value={formCategoria.edadMinima}
                onChange={handleChangeCategoria}
                fullWidth
              />
              <TextField
                name="edadMaxima"
                label="Edad Máxima"
                type="number"
                value={formCategoria.edadMaxima}
                onChange={handleChangeCategoria}
                fullWidth
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>Género</InputLabel>
              <Select
                name="genero"
                value={formCategoria.genero}
                label="Género"
                onChange={handleChangeCategoria}
              >
                <MenuItem value="mixto">Mixto</MenuItem>
                <MenuItem value="masculino">Masculino</MenuItem>
                <MenuItem value="femenino">Femenino</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="descripcion"
              label="Descripción (opcional)"
              value={formCategoria.descripcion}
              onChange={handleChangeCategoria}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogCategoria}>Cancelar</Button>
          <Button onClick={handleSubmitCategoria} variant="contained">
            {editandoCategoria ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PanelOrganizador;