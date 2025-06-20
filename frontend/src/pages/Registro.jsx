import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Registro = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
    rol: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

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
      setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      setForm({
        nombre: "",
        apellido: "",
        email: "",
        contrasena: "",
        rol: ""
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Error al registrarse. Verifica los datos."
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Registro de Nuevo Usuario
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <TextField
          label="Apellido"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Contraseña"
          type="password"
          name="contrasena"
          value={form.contrasena}
          onChange={handleChange}
          required
        />

        <FormControl fullWidth>
          <InputLabel id="rol-label">Perfil</InputLabel>
          <Select
            labelId="rol-label"
            label="Perfil"
            name="rol"
            value={form.rol}
            onChange={handleChange}
            required
          >
            <MenuItem value="corredor">Corredor</MenuItem>
            <MenuItem value="organizador">Organizador</MenuItem>
            <MenuItem value="cronometrista">Cronometrista</MenuItem>
          </Select>
        </FormControl>

        <Button type="submit" variant="contained">
          Registrarse
        </Button>
      </Box>
    </Container>
  );
};

export default Registro;