const express = require('express');
const router = express.Router();

// Importamos el controlador de eventos
const eventoController = require('../controllers/eventoController');

// Ruta para obtener todos los eventos
router.get('/', eventoController.getEventos);

// Ruta para obtener un evento por ID
router.get('/:id', eventoController.getEventoPorId);

// Ruta para crear un nuevo evento
router.post('/', eventoController.crearEvento);

// Ruta para actualizar un evento existente
router.put('/:id', eventoController.actualizarEvento);

// Ruta para eliminar un evento
router.delete('/:id', eventoController.eliminarEvento);

// Exportamos el router
module.exports = router;