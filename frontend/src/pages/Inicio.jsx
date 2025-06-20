import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button
} from "@mui/material";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Inicio = () => {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/eventos")
      .then(res => {
        const activos = res.data
          .filter(evt => evt.estado === "activo")
          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        setEventos(activos);
      })
      .catch(err => console.error("Error al cargar eventos", err));
  }, []);

  const handleOrganizador = () => {
    if (usuario?.perfil === "organizador") {
      navigate("/organizador");
    } else {
      navigate("/login");
    }
  };

  const handleCronometrista = () => {
    if (usuario?.perfil === "cronometrista") {
      navigate("/cronometrista");
    } else {
      navigate("/login");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{
          background: "linear-gradient(to right, #c1d9f1, #f6c1f2)",
          p: 4,
          borderRadius: 2,
          textAlign: "center",
          mb: 6
        }}
      >
        <DirectionsRunIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          GO! SPORTS
        </Typography>
        <Typography variant="h6" gutterBottom>
          LA PLATAFORMA INTEGRAL PARA EL DEPORTE
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            sx={{ mr: 2 }}
            onClick={handleOrganizador}
          >
            + SOY ORGANIZADOR
          </Button>
          <Button variant="outlined" onClick={handleCronometrista}>
            + SOY CRONOMETRISTA
          </Button>
        </Box>
      </Box>

      <Typography variant="h4" gutterBottom>
        Próximos Eventos
      </Typography>
      <Grid container spacing={2}>
        {eventos.length ? (
          eventos.map(evt => (
            <Grid item xs={12} sm={6} md={4} key={evt.idEvento}>
              <Card>
                <CardContent>
                  <Typography variant="h5">{evt.nombre}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                  >
                    {evt.descripcion}
                  </Typography>
                  <Typography variant="subtitle2">
                    Fecha: {new Date(evt.fecha).toLocaleDateString()}
                  </Typography>
                  <Typography variant="subtitle2">
                    Lugar: {evt.lugar}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to="/inscripciones">
                    Inscribirse
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No hay eventos disponibles.</Typography>
        )}
      </Grid>
    </Container>
  );
};

export default Inicio;