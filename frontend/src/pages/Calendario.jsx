import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Modal,
  Backdrop,
  Fade,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Paper,
  Divider
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const Calendario = () => {
  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [eventosDelDia, setEventosDelDia] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const obtenerEventos = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/eventos");
        setEventos(res.data);
      } catch (error) {
        console.error("Error al obtener eventos", error);
      }
    };
    obtenerEventos();
  }, []);

  const handleClickDia = (date) => {
    setFechaSeleccionada(date);
    const fechaISO = date.toISOString().split("T")[0];

    const filtrados = eventos.filter((evento) => {
      const fechaEvento = evento.fecha.split("T")[0];
      return fechaEvento === fechaISO;
    });

    setEventosDelDia(filtrados);
    setOpen(true);
  };

  const tileContent = ({ date }) => {
    const fechaISO = date.toISOString().split("T")[0];
    const tieneEvento = eventos.some((evento) => {
      const fechaEvento = evento.fecha.split("T")[0];
      return fechaEvento === fechaISO;
    });

    return tieneEvento ? (
      <Box
        sx={{
          width: 8,
          height: 8,
          bgcolor: '#667eea',
          borderRadius: '50%',
          margin: '0 auto',
          mt: 0.5
        }}
      />
    ) : null;
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <EventIcon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{ fontWeight: 700, color: '#333' }}
        >
          Calendario de eventos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Selecciona una fecha para ver los eventos programados
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          maxWidth: 800,
          mx: 'auto',
          borderRadius: 3,
          '& .react-calendar': {
            width: '100%',
            border: 'none',
            fontFamily: 'inherit',
            '& button': {
              fontSize: '16px',
              padding: '12px',
              '&:hover': {
                background: 'rgba(102, 126, 234, 0.1)'
              }
            },
            '& .react-calendar__tile--active': {
              background: '#667eea',
              color: 'white',
              '&:hover': {
                background: '#764ba2'
              }
            },
            '& .react-calendar__tile--now': {
              background: 'rgba(102, 126, 234, 0.2)',
              fontWeight: 600
            },
            '& .react-calendar__navigation button': {
              fontSize: '18px',
              fontWeight: 600,
              color: '#667eea'
            }
          }
        }}
      >
        <Calendar 
          onClickDay={handleClickDia} 
          tileContent={tileContent}
          locale="es-ES"
        />
      </Paper>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ 
          timeout: 500,
          sx: { backdropFilter: 'blur(5px)' }
        }}
      >
        <Fade in={open}>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: '90%', sm: 500 },
              maxHeight: '80vh',
              overflow: 'auto',
              borderRadius: 3,
              boxShadow: 24,
              p: 0
            }}
          >
            {/* Header del modal */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                p: 3,
                position: 'relative'
              }}
            >
              <IconButton
                onClick={() => setOpen(false)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'white'
                }}
              >
                <CloseIcon />
              </IconButton>
              
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Eventos del día
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {fechaSeleccionada?.toLocaleDateString('es-AR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </Typography>
            </Box>

            {/* Contenido del modal */}
            <Box sx={{ p: 3 }}>
              {eventosDelDia.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {eventosDelDia.map((evento, index) => (
                    <Box key={evento.idEvento}>
                      <ListItem
                        sx={{
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          p: 2,
                          bgcolor: 'rgba(102, 126, 234, 0.05)',
                          borderRadius: 2,
                          mb: 2
                        }}
                      >
                        <Box sx={{ width: '100%', mb: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: '#333', mb: 1 }}
                          >
                            {evento.nombre}
                          </Typography>
                          <Chip
                            label={evento.estado}
                            size="small"
                            color="success"
                            sx={{ mb: 2 }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon sx={{ fontSize: 20, color: '#667eea' }} />
                            <Typography variant="body2" color="text.secondary">
                              {evento.lugar}
                            </Typography>
                          </Box>

                          {evento.hora && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AccessTimeIcon sx={{ fontSize: 20, color: '#667eea' }} />
                              <Typography variant="body2" color="text.secondary">
                                {evento.hora}
                              </Typography>
                            </Box>
                          )}

                          {evento.descripcion && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 1, fontStyle: 'italic' }}
                            >
                              {evento.descripcion}
                            </Typography>
                          )}
                        </Box>
                      </ListItem>
                    </Box>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <EventIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No hay eventos programados
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    para este día
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Fade>
      </Modal>
    </Container>
  );
};

export default Calendario;