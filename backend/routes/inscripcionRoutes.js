const express = require('express');
const router = express.Router();
const inscripcionController = require('../controllers/inscripcionController');

// Crear nueva inscripción
router.post('/', inscripcionController.crearInscripcion);

// Obtener inscriptos de un evento (con datos de categoría)
router.get('/evento/:idEvento', inscripcionController.obtenerInscritosPorEvento);

// Obtener inscripciones de un usuario
router.get('/usuario/:idUsuario', inscripcionController.obtenerInscripcionesPorUsuario);

// Verificar si un usuario está inscrito en un evento
router.get('/verificar/:idEvento/:idUsuario', inscripcionController.verificarInscripcion);

// Actualizar inscripción
router.put('/:id', inscripcionController.actualizarInscripcion);

// Eliminar inscripción
router.delete('/:id', inscripcionController.eliminarInscripcion);

module.exports = router;