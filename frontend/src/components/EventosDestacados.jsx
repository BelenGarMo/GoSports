import { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import axios from "axios";

const EventosDestacados = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/eventos");
        setEventos(res.data);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    fetchEventos();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Próximos eventos
      </Typography>
      <Grid container spacing={2}>
        {eventos.map((evento) => (
          <Grid item xs={12} sm={6} md={4} key={evento.idEvento}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6">{evento.nombre}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {evento.descripcion}
                </Typography>
                <Typography variant="body2">
                  <strong>Fecha:</strong> {evento.fecha}
                </Typography>
                <Typography variant="body2">
                  <strong>Lugar:</strong> {evento.lugar}
                </Typography>
                <Button variant="outlined" sx={{ mt: 2 }}>
                  Leer más
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EventosDestacados;