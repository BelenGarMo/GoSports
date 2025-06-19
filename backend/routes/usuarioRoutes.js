const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Ruta para obtener todos los usuarios
router.get('/', usuarioController.obtenerUsuarios);

// Ruta para obtener un solo usuario por ID
router.get('/:id', usuarioController.obtenerUsuarioPorId);

// Ruta para crear un nuevo usuario
router.post('/', usuarioController.crearUsuario);

// Ruta para actualizar un usuario existente
router.put('/:id', usuarioController.actualizarUsuario);

// Ruta para eliminar un usuario
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;