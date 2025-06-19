const Inscripcion = require('../models/inscripcionModels');

// Creamos un objeto controlador con todas las funciones necesarias
const inscripcionController = {
  // Obtener todas las inscripciones
  obtenerInscripciones: (req, res) => {
    Inscripcion.getAll((err, resultados) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener las inscripciones' });
      }
      res.status(200).json(resultados);
    });
  },

  // Obtener una inscripción por ID
  obtenerInscripcionPorId: (req, res) => {
    const id = req.params.id;
    Inscripcion.getById(id, (err, resultado) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener la inscripción' });
      }
      if (resultado.length === 0) {
        return res.status(404).json({ mensaje: 'Inscripción no encontrada' });
      }
      res.status(200).json(resultado[0]);
    });
  },

  // Crear una nueva inscripción
  crearInscripcion: (req, res) => {
    const nuevaInscripcion = req.body;
    Inscripcion.create(nuevaInscripcion, (err, resultado) => {
      if (err) {
        return res.status(500).json({ error: 'Error al crear la inscripción' });
      }
      res.status(201).json({ mensaje: 'Inscripción creada correctamente', idInsertado: resultado.insertId });
    });
  },

  // Actualizar una inscripción
  actualizarInscripcion: (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;
    Inscripcion.update(id, datosActualizados, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar la inscripción' });
      }
      res.status(200).json({ mensaje: 'Inscripción actualizada correctamente' });
    });
  },

  // Eliminar una inscripción
  eliminarInscripcion: (req, res) => {
    const id = req.params.id;
    Inscripcion.delete(id, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al eliminar la inscripción' });
      }
      res.status(200).json({ mensaje: 'Inscripción eliminada correctamente' });
    });
  }
};

module.exports = inscripcionController;