const Usuario = require('../models/usuarioModels');

// Creamos un objeto controlador con todas las funciones necesarias
const usuarioController = {
  // Obtener todos los usuarios
  obtenerUsuarios: (req, res) => {
    Usuario.getAll((err, resultados) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener usuarios', error: err });
      }
      res.status(200).json(resultados);
    });
  },

  // Obtener un usuario por ID
  obtenerUsuarioPorId: (req, res) => {
    const id = req.params.id;
    Usuario.getById(id, (err, resultado) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener el usuario', error: err });
      }
      if (resultado.length === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      res.status(200).json(resultado[0]);
    });
  },

  // Crear un nuevo usuario
  crearUsuario: (req, res) => {
    const nuevoUsuario = req.body;
    Usuario.create(nuevoUsuario, (err, resultado) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al crear usuario', error: err });
      }
      res.status(201).json({ mensaje: 'Usuario creado correctamente', idInsertado: resultado.insertId });
    });
  },

  // Actualizar un usuario existente
  actualizarUsuario: (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;
    Usuario.update(id, datosActualizados, (err) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al actualizar usuario', error: err });
      }
      res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
    });
  },

  // Eliminar un usuario
  eliminarUsuario: (req, res) => {
    const id = req.params.id;
    Usuario.delete(id, (err) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al eliminar usuario', error: err });
      }
      res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
    });
  }
};

module.exports = usuarioController;