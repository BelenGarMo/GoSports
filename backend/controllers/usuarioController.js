const Usuario = require('../models/usuarioModels');
const jwt = require('jsonwebtoken');

const usuarioController = {
  obtenerUsuarios: (req, res) => {
    Usuario.getAll((err, resultados) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener usuarios', error: err });
      }
      res.status(200).json(resultados);
    });
  },

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

  crearUsuario: (req, res) => {
    const nuevoUsuario = req.body;
    Usuario.create(nuevoUsuario, (err, resultado) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al crear usuario', error: err });
      }
      res.status(201).json({ mensaje: 'Usuario creado correctamente', idInsertado: resultado.insertId });
    });
  },

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

  eliminarUsuario: (req, res) => {
    const id = req.params.id;
    Usuario.delete(id, (err) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al eliminar usuario', error: err });
      }
      res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
    });
  },

  login: (req, res) => {
    const { email, contraseña } = req.body;
    Usuario.findByEmail(email, (err, resultado) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al buscar el usuario', error: err });
      }
      if (resultado.length === 0 || resultado[0].contraseña !== contraseña) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }

      const usuario = resultado[0];
      const token = jwt.sign({ id: usuario.idUsuario, perfil: usuario.rol }, 'secreto', { expiresIn: '4h' });

      res.status(200).json({
        mensaje: 'Login exitoso',
        token,
        usuario: {
          id: usuario.idUsuario,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          perfil: usuario.rol
        }
      });
    });
  }
};

module.exports = usuarioController;