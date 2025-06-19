const Evento = require('../models/eventoModels');

// Creamos un objeto controlador para manejar la lógica de los endpoints
const eventoController = {
  // Obtener todos los eventos
  getEventos: (req, res) => {
    Evento.obtenerTodos((err, resultados) => {
      if (err) {
        console.error('Error al obtener eventos:', err);
        return res.status(500).json({ error: 'Error al obtener eventos' });
      }
      res.json(resultados);
    });
  },

  // Obtener un evento por su ID
  getEventoPorId: (req, res) => {
    const { id } = req.params;
    Evento.obtenerPorId(id, (err, resultado) => {
      if (err) {
        console.error('Error al obtener el evento:', err);
        return res.status(500).json({ error: 'Error al obtener el evento' });
      }
      if (resultado.length === 0) {
        return res.status(404).json({ mensaje: 'Evento no encontrado' });
      }
      res.json(resultado[0]);
    });
  },

  // Crear un nuevo evento
  crearEvento: (req, res) => {
    const nuevoEvento = req.body;
    Evento.crear(nuevoEvento, (err, resultado) => {
      if (err) {
        console.error('Error al crear el evento:', err);
        return res.status(500).json({ error: 'Error al crear el evento' });
      }
      res.status(201).json({ mensaje: 'Evento creado correctamente', id: resultado.insertId });
    });
  },

  // Actualizar un evento existente
  actualizarEvento: (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;
    Evento.actualizar(id, datosActualizados, (err, resultado) => {
      if (err) {
        console.error('Error al actualizar el evento:', err);
        return res.status(500).json({ error: 'Error al actualizar el evento' });
      }
      res.json({ mensaje: 'Evento actualizado correctamente' });
    });
  },

  // Eliminar un evento
  eliminarEvento: (req, res) => {
    const { id } = req.params;
    Evento.eliminar(id, (err, resultado) => {
      if (err) {
        console.error('Error al eliminar el evento:', err);
        return res.status(500).json({ error: 'Error al eliminar el evento' });
      }
      res.json({ mensaje: 'Evento eliminado correctamente' });
    });
  }
};

module.exports = eventoController;