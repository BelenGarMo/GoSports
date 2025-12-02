import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  CardMedia,
  Fade
} from "@mui/material";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Inicio = () => {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/eventos")
      .then(res => {
        const activos = res.data
          .filter(evt => evt.estado === "activo")
          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        setEventos(activos);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar eventos", err);
        setLoading(false);
      });
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

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Hero Section con gradiente */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          px: 2,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto 20px',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }}
              >
                <DirectionsRunIcon sx={{ fontSize: 60 }} />
              </Avatar>

              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                GO! SPORTS
              </Typography>

              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  mb: 4,
                  opacity: 0.95,
                  fontWeight: 300
                }}
              >
                LA PLATAFORMA INTEGRAL PARA EL DEPORTE
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleOrganizador}
                  startIcon={<PeopleIcon />}
                  sx={{
                    bgcolor: 'white',
                    color: '#667eea',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      transform: 'scale(1.05)',
                      transition: 'all 0.3s'
                    }
                  }}
                >
                  SOY ORGANIZADOR
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleCronometrista}
                  startIcon={<EmojiEventsIcon />}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'scale(1.05)',
                      transition: 'all 0.3s'
                    }
                  }}
                >
                  SOY CRONOMETRISTA
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Sección de Eventos */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: '#333',
              mb: 1
            }}
          >
            Próximos Eventos
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Descubre las mejores competencias deportivas
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <DirectionsRunIcon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
            <Typography>Cargando eventos...</Typography>
          </Box>
        ) : eventos.length > 0 ? (
          <Grid container spacing={3}>
            {eventos.map((evt, index) => (
              <Grid item xs={12} sm={6} md={4} key={evt.idEvento}>
                <Fade in timeout={500 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardMedia
                      sx={{
                        height: 180,
                        background: `linear-gradient(135deg, ${
                          index % 3 === 0 ? '#667eea, #764ba2' :
                          index % 3 === 1 ? '#f093fb, #f5576c' :
                          '#4facfe, #00f2fe'
                        })`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <DirectionsRunIcon sx={{ fontSize: 80, color: 'white', opacity: 0.8 }} />
                    </CardMedia>

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        gutterBottom
                        sx={{ fontWeight: 600, color: '#333' }}
                      >
                        {evt.nombre}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 2
                        }}
                      >
                        {evt.descripcion}
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Chip
                          icon={<CalendarTodayIcon />}
                          label={formatearFecha(evt.fecha)}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                        <Chip
                          icon={<LocationOnIcon />}
                          label={evt.lugar}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                        <Chip
                          label={evt.estado.toUpperCase()}
                          size="small"
                          color="success"
                        />
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        component={Link}
                        to="/inscripciones"
                        variant="contained"
                        fullWidth
                        sx={{
                          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                          color: 'white',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
                          }
                        }}
                      >
                        Inscribirse
                      </Button>
                    </CardActions>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <EmojiEventsIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No hay eventos disponibles en este momento
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              ¡Vuelve pronto para ver nuevas competencias!
            </Typography>
          </Box>
        )}
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: '#333',
          color: 'white',
          py: 4,
          mt: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body1" sx={{ mb: 1 }}>
            © 2025 GO! SPORTS - Plataforma Integral para el Deporte
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.7)">
            Desarrollado con ❤️ para la comunidad deportiva
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Inicio;