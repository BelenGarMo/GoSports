import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Radio,
  FormControlLabel,
  RadioGroup
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import PeopleIcon from "@mui/icons-material/People";
import TimerIcon from "@mui/icons-material/Timer";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Registro = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contraseña: "",
    rol: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const roles = [
    {
      value: 'corredor',
      label: 'Corredor',
      icon: <DirectionsRunIcon sx={{ fontSize: 40 }} />,
      description: 'Participante en eventos deportivos',
      color: '#667eea'
    },
    {
      value: 'organizador',
      label: 'Organizador',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      description: 'Gestiona y crea eventos',
      color: '#f093fb'
    },
    {
      value: 'cronometrista',
      label: 'Cronometrista',
      icon: <TimerIcon sx={{ fontSize: 40 }} />,
      description: 'Registra tiempos oficiales',
      color: '#4facfe'
    }
  ];

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rol) {
      setError("Debes seleccionar un perfil");
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/usuarios", form);
      setSuccess("¡Registro exitoso! Redirigiendo al login...");
      setForm({
        nombre: "",
        apellido: "",
        email: "",
        contraseña: "",
        rol: ""
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Error al registrarse. Verifica los datos."
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 6,
        px: 2
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <PersonAddIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: 700, color: '#333' }}
            >
              Crear Cuenta
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Unite a la comunidad de GO! SPORTS
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Datos personales */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Apellido"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Contraseña"
                  type="password"
                  name="contraseña"
                  value={form.contraseña}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  helperText="Mínimo 6 caracteres"
                />
              </Grid>
            </Grid>

            {/* Selección de perfil con cards */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, color: '#333' }}
              >
                Selecciona tu perfil
              </Typography>
              
              <RadioGroup
                name="rol"
                value={form.rol}
                onChange={handleChange}
              >
                <Grid container spacing={2}>
                  {roles.map((rol) => (
                    <Grid item xs={12} sm={4} key={rol.value}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: form.rol === rol.value ? `3px solid ${rol.color}` : '2px solid #e0e0e0',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 8px 16px ${rol.color}40`
                          }
                        }}
                        onClick={() => setForm({ ...form, rol: rol.value })}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Avatar
                            sx={{
                              width: 60,
                              height: 60,
                              margin: '0 auto 16px',
                              bgcolor: form.rol === rol.value ? rol.color : '#e0e0e0',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {rol.icon}
                          </Avatar>
                          <FormControlLabel
                            value={rol.value}
                            control={<Radio sx={{ display: 'none' }} />}
                            label={
                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    color: form.rol === rol.value ? rol.color : '#333'
                                  }}
                                >
                                  {rol.label}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 0.5 }}
                                >
                                  {rol.description}
                                </Typography>
                              </Box>
                            }
                            sx={{ m: 0 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </Box>

            {/* Botón de registro */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 2,
                py: 1.5,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                fontSize: '16px',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
                  transform: 'scale(1.02)',
                  transition: 'all 0.3s'
                }
              }}
            >
              Registrarse
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                ¿Ya tenés cuenta?{' '}
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    color: '#667eea'
                  }}
                >
                  Inicia sesión aquí
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Registro;