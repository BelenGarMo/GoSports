const express = require('express');
const router = express.Router();
const archivoTiemposController = require('../controllers/archivoTiemposController');

// Rutas para archivo de tiempos
router.get('/', archivoTiemposController.obtenerArchivos);
router.get('/:id', archivoTiemposController.obtenerArchivoPorId);
router.post('/', archivoTiemposController.crearArchivo);
router.put('/:id', archivoTiemposController.actualizarArchivo);
router.delete('/:id', archivoTiemposController.eliminarArchivo);

module.exports = router;