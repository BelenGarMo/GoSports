const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./config/db');

// Middleware para permitir solicitudes desde otros origenes (por ejemplo, desde el frontend)
app.use(cors());

// Middleware para parsear solicitudes con JSON
app.use(express.json());

//verificamos la conexion a la base de datos
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
  connection.release();
});

// Importamos todas las rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const inscripcionRoutes = require('./routes/inscripcionRoutes');
const resultadoRoutes = require('./routes/resultadoRoutes');
const archivoTiemposRoutes = require('./routes/archivoTiemposRoutes');
const notificacionRoutes = require('./routes/notificacionRoutes');

// Definimos los prefijos para cada grupo de rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/inscripciones', inscripcionRoutes);
app.use('/api/resultados', resultadoRoutes);
app.use('/api/archivotiempos', archivoTiemposRoutes);
app.use('/api/notificacion', notificacionRoutes);

// Definimos el puerto donde se va a ejecutar el servidor
const PORT = process.env.PORT || 3001;

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});