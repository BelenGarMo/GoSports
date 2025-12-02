const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Obtener categorías de un evento
router.get('/evento/:idEvento', categoriaController.obtenerPorEvento);

// Obtener una categoría por ID
router.get('/:id', categoriaController.obtenerPorId);

// Crear nueva categoría
router.post('/', categoriaController.crearCategoria);

// Actualizar categoría
router.put('/:id', categoriaController.actualizarCategoria);

// Eliminar categoría
router.delete('/:id', categoriaController.eliminarCategoria);

module.exports = router;