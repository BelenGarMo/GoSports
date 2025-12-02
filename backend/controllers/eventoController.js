const Evento = require('../models/eventoModels');

const eventoController = {
  // Obtener todos los eventos (público - cualquiera puede ver)
  getEventos: (req, res) => {
    Evento.obtenerTodos((err, resultados) => {
      if (err) {
        console.error('Error al obtener eventos:', err);
        return res.status(500).json({ error: 'Error al obtener eventos' });
      }
      res.json(resultados);
    });
  },

  // Obtener eventos creados por un organizador específico
  getEventosPorCreador: (req, res) => {
    const { idCreador } = req.params;
    Evento.obtenerPorCreador(idCreador, (err, resultados) => {
      if (err) {
        console.error('Error al obtener eventos del creador:', err);
        return res.status(500).json({ error: 'Error al obtener eventos' });
      }
      res.json(resultados);
    });
  },

  // Obtener un evento por su ID (público)
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

  // Crear un nuevo evento (solo organizadores y cronometristas)
  crearEvento: (req, res) => {
    const nuevoEvento = req.body;
    
    // Validar que venga el idCreador
    if (!nuevoEvento.idCreador) {
      return res.status(400).json({ error: 'El ID del creador es obligatorio' });
    }

    // Validar campos requeridos
    if (!nuevoEvento.nombre || !nuevoEvento.fecha || !nuevoEvento.lugar) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    Evento.crear(nuevoEvento, (err, resultado) => {
      if (err) {
        console.error('Error al crear el evento:', err);
        return res.status(500).json({ error: 'Error al crear el evento' });
      }
      res.status(201).json({ 
        mensaje: 'Evento creado correctamente', 
        id: resultado.insertId 
      });
    });
  },

  // Actualizar un evento (solo el creador puede actualizarlo)
  actualizarEvento: (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;
    const { idUsuario, perfil } = req.body; // Estos vienen del frontend

    // Primero verificamos quién es el creador del evento
    Evento.obtenerPorId(id, (err, resultado) => {
      if (err) {
        console.error('Error al obtener el evento:', err);
        return res.status(500).json({ error: 'Error al verificar el evento' });
      }

      if (resultado.length === 0) {
        return res.status(404).json({ mensaje: 'Evento no encontrado' });
      }

      const evento = resultado[0];

      // Verificar permisos: solo el creador o un cronometrista puede actualizar
      if (evento.idCreador !== idUsuario && perfil !== 'cronometrista') {
        return res.status(403).json({ 
          mensaje: 'No tienes permisos para modificar este evento' 
        });
      }

      // Actualizar el evento
      Evento.actualizar(id, datosActualizados, (err) => {
        if (err) {
          console.error('Error al actualizar el evento:', err);
          return res.status(500).json({ error: 'Error al actualizar el evento' });
        }
        res.json({ mensaje: 'Evento actualizado correctamente' });
      });
    });
  },

  // Eliminar un evento (solo el creador puede eliminarlo)
  eliminarEvento: (req, res) => {
    const { id } = req.params;
    const { idUsuario, perfil } = req.body;

    // Verificar quién es el creador
    Evento.obtenerPorId(id, (err, resultado) => {
      if (err) {
        console.error('Error al obtener el evento:', err);
        return res.status(500).json({ error: 'Error al verificar el evento' });
      }

      if (resultado.length === 0) {
        return res.status(404).json({ mensaje: 'Evento no encontrado' });
      }

      const evento = resultado[0];

      // Solo el creador puede eliminar
      if (evento.idCreador !== idUsuario) {
        return res.status(403).json({ 
          mensaje: 'Solo el creador puede eliminar este evento' 
        });
      }

      Evento.eliminar(id, (err) => {
        if (err) {
          console.error('Error al eliminar el evento:', err);
          return res.status(500).json({ error: 'Error al eliminar el evento' });
        }
        res.json({ mensaje: 'Evento eliminado correctamente' });
      });
    });
  }
};

module.exports = eventoController;