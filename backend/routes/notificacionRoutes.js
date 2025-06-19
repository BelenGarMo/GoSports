const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');

// Ruta para obtener todas las notificaciones
router.get('/', notificacionController.obtenerNotificaciones);

// Ruta para obtener una notificación por ID
router.get('/:id', notificacionController.obtenerNotificacionPorId);

// Ruta para crear una nueva notificación
router.post('/', notificacionController.crearNotificacion);

// Ruta para actualizar una notificación existente
router.put('/:id', notificacionController.actualizarNotificacion);

// Ruta para eliminar una notificación
router.delete('/:id', notificacionController.eliminarNotificacion);

module.exports = router;