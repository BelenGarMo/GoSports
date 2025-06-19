const ArchivoTiempos = require('../models/archivoTiemposModels');

// Creamos un objeto controlador con todas las funciones necesarias
const archivoTiemposController = {
  // Obtener todos los archivos de tiempos
  obtenerArchivos: (req, res) => {
    ArchivoTiempos.getAll((err, resultados) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener archivos de tiempos', error: err });
      }
      res.status(200).json(resultados);
    });
  },

  // Obtener un archivo por ID
  obtenerArchivoPorId: (req, res) => {
    const id = req.params.id;
    ArchivoTiempos.getById(id, (err, resultado) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener archivo', error: err });
      }
      if (resultado.length === 0) {
        return res.status(404).json({ mensaje: 'Archivo no encontrado' });
      }
      res.status(200).json(resultado[0]);
    });
  },

  // Crear un nuevo archivo
  crearArchivo: (req, res) => {
    const nuevoArchivo = req.body;
    ArchivoTiempos.create(nuevoArchivo, (err, resultado) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al crear archivo de tiempos', error: err });
      }
      res.status(201).json({ mensaje: 'Archivo creado correctamente', idInsertado: resultado.insertId });
    });
  },

  // Actualizar un archivo existente
  actualizarArchivo: (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;
    ArchivoTiempos.update(id, datosActualizados, (err) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al actualizar archivo de tiempos', error: err });
      }
      res.status(200).json({ mensaje: 'Archivo actualizado correctamente' });
    });
  },

  // Eliminar un archivo
  eliminarArchivo: (req, res) => {
    const id = req.params.id;
    ArchivoTiempos.delete(id, (err) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al eliminar archivo de tiempos', error: err });
      }
      res.status(200).json({ mensaje: 'Archivo eliminado correctamente' });
    });
  }
};

module.exports = archivoTiemposController;