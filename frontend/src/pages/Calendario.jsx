import { useEffect, useState } from "react";
import { Container, Typography, Box, Modal, Backdrop, Fade, List, ListItem, ListItemText } from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

const Calendario = () => {
  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [eventosDelDia, setEventosDelDia] = useState([]);
  const [open, setOpen] = useState(false);

  // Traer los eventos desde la base de datos al cargar la página
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

  // Manejar el clic en una fecha del calendario
  const handleClickDia = (date) => {
    setFechaSeleccionada(date);
    const fechaISO = date.toISOString().split("T")[0];

    // Filtrar los eventos cuya fecha coincida (solo fecha, sin hora)
    const filtrados = eventos.filter((evento) => {
      const fechaEvento = evento.fecha.split("T")[0];
      return fechaEvento === fechaISO;
    });

    setEventosDelDia(filtrados);
    setOpen(true);
  };

  // Mostrar un punto rojo en los días que tienen eventos
  const tileContent = ({ date }) => {
    const fechaISO = date.toISOString().split("T")[0];
    const tieneEvento = eventos.some((evento) => {
      const fechaEvento = evento.fecha.split("T")[0];
      return fechaEvento === fechaISO;
    });

    return tieneEvento ? <div style={{ textAlign: "center", color: "red" }}>•</div> : null;
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Calendario de Eventos
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Calendar onClickDay={handleClickDia} tileContent={tileContent} />
      </Box>

      {/* Modal con los eventos del día seleccionado */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4
          }}>
            <Typography variant="h6" gutterBottom>
              Eventos del {fechaSeleccionada?.toLocaleDateString()}
            </Typography>

            {eventosDelDia.length > 0 ? (
              <List>
                {eventosDelDia.map((evento) => (
                  <ListItem key={evento.idEvento}>
                    <ListItemText
                      primary={evento.nombre}
                      secondary={`Lugar: ${evento.lugar} - Hora: ${evento.hora}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No hay eventos para este día.</Typography>
            )}
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default Calendario;