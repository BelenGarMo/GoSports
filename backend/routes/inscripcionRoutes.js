const express = require('express');
const router = express.Router();
const inscripcionController = require('../controllers/inscripcionController');

// Ruta para obtener todas las inscripciones
router.get('/', inscripcionController.obtenerInscripciones);

// Ruta para obtener una inscripción por ID
router.get('/:id', inscripcionController.obtenerInscripcionPorId);

// Ruta para crear una nueva inscripción
router.post('/', inscripcionController.crearInscripcion);

// Ruta para actualizar una inscripción existente
router.put('/:id', inscripcionController.actualizarInscripcion);

// Ruta para eliminar una inscripción
router.delete('/:id', inscripcionController.eliminarInscripcion);

module.exports = router;