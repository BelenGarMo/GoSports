const Notificacion = require('../models/notificacionModels');

// Creamos un objeto controlador con todas las funciones necesarias
const notificacionController = {
  // Obtener todas las notificaciones
  obtenerNotificaciones: (req, res) => {
    Notificacion.getAll((err, resultados) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener notificaciones', error: err });
      }
      res.status(200).json(resultados);
    });
  },

  // Obtener una notificación por ID
  obtenerNotificacionPorId: (req, res) => {
    const id = req.params.id;
    Notificacion.getById(id, (err, resultado) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener la notificación', error: err });
      }
      if (resultado.length === 0) {
        return res.status(404).json({ mensaje: 'Notificación no encontrada' });
      }
      res.status(200).json(resultado[0]);
    });
  },

  // Crear una nueva notificación
  crearNotificacion: (req, res) => {
    const nuevaNotificacion = req.body;
    Notificacion.create(nuevaNotificacion, (err, resultado) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al crear notificación', error: err });
      }
      res.status(201).json({ mensaje: 'Notificación creada correctamente', idInsertado: resultado.insertId });
    });
  },

  // Actualizar una notificación existente
  actualizarNotificacion: (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;
    Notificacion.update(id, datosActualizados, (err) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al actualizar notificación', error: err });
      }
      res.status(200).json({ mensaje: 'Notificación actualizada correctamente' });
    });
  },

  // Eliminar una notificación
  eliminarNotificacion: (req, res) => {
    const id = req.params.id;
    Notificacion.delete(id, (err) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al eliminar notificación', error: err });
      }
      res.status(200).json({ mensaje: 'Notificación eliminada correctamente' });
    });
  }
};

module.exports = notificacionController;