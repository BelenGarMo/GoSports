import { useState } from "react";
import { Container, Typography, Box, TextField, Button, Alert } from "@mui/material";
import axios from "axios";

const RecuperarContrasena = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/usuarios/recuperar", { email });
      setMensaje("Si el email está registrado, recibirás instrucciones pronto.");
      setError("");
    } catch (err) {
      setError("No se pudo procesar la solicitud");
      setMensaje("");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Recuperar Contraseña
      </Typography>
      {mensaje && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {mensaje}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Button type="submit" variant="contained">
          Enviar instrucciones
        </Button>
      </Box>
    </Container>
  );
};

export default RecuperarContrasena;