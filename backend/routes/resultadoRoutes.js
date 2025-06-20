const express = require('express');
const router = express.Router();
const resultadoController = require('../controllers/resultadoController');

// Ruta para obtener todos los resultados
router.get('/', resultadoController.obtenerResultados);

// Ruta para obtener resultados por id de evento
router.get('/evento/:idEvento', resultadoController.obtenerResultadosPorEvento);

// Ruta para obtener un resultado por ID
router.get('/:id', resultadoController.obtenerResultadoPorId);

// Ruta para crear un nuevo resultado
router.post('/', resultadoController.crearResultado);

// Ruta para actualizar un resultado existente
router.put('/:id', resultadoController.actualizarResultado);

// Ruta para eliminar un resultado
router.delete('/:id', resultadoController.eliminarResultado);

module.exports = router;