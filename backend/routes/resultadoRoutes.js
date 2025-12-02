const express = require('express');
const router = express.Router();
const resultadoController = require('../controllers/resultadoController');

// Crear nuevo resultado
router.post('/', resultadoController.crearResultado);

// Obtener resultados de un evento (con datos de categoría)
router.get('/evento/:idEvento', resultadoController.obtenerResultadosPorEvento);

// Obtener resultados por categoría específica
router.get('/evento/:idEvento/categoria/:idCategoria', resultadoController.obtenerResultadosPorCategoria);

// Obtener resultados de un usuario
router.get('/usuario/:idUsuario', resultadoController.obtenerResultadosPorUsuario);

// Obtener un resultado específico
router.get('/:id', resultadoController.obtenerResultadoPorId);

// Actualizar resultado
router.put('/:id', resultadoController.actualizarResultado);

// Eliminar resultado
router.delete('/:id', resultadoController.eliminarResultado);

// Obtener estadísticas de un evento
router.get('/evento/:idEvento/estadisticas', resultadoController.obtenerEstadisticas);

module.exports = router;