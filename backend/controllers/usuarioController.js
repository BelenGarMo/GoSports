const Usuario = require('../models/usuarioModels');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

  crearUsuario: async (req, res) => {
    try {
      const nuevoUsuario = req.body;
      
      if (nuevoUsuario.contraseña) {
        const hashedPassword = await bcrypt.hash(nuevoUsuario.contraseña, saltRounds);
        nuevoUsuario.contraseña = hashedPassword;
      }

      Usuario.create(nuevoUsuario, (err, resultado) => {
        if (err) {
          return res.status(500).json({ mensaje: 'Error al crear usuario', error: err });
        }
        res.status(201).json({ mensaje: 'Usuario creado correctamente', idInsertado: resultado.insertId });
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al procesar la contraseña', error: error.message });
    }
  },

  actualizarUsuario: async (req, res) => {
    try {
      const id = req.params.id;
      const datosActualizados = req.body;

      if (datosActualizados.contraseña) {
        const hashedPassword = await bcrypt.hash(datosActualizados.contraseña, saltRounds);
        datosActualizados.contraseña = hashedPassword;
      }

      Usuario.update(id, datosActualizados, (err) => {
        if (err) {
          return res.status(500).json({ mensaje: 'Error al actualizar usuario', error: err });
        }
        res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al procesar la contraseña', error: error.message });
    }
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

  login: async (req, res) => {
    try {
      const { email, contraseña } = req.body;
      
      Usuario.findByEmail(email, async (err, resultado) => {
        if (err) {
          return res.status(500).json({ mensaje: 'Error al buscar el usuario', error: err });
        }
        
        if (resultado.length === 0) {
          return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const usuario = resultado[0];

        const match = await bcrypt.compare(contraseña, usuario.contraseña);
        
        if (!match) {
          return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: usuario.idUsuario, perfil: usuario.rol }, 'secreto', { expiresIn: '4h' });

        res.status(200).json({
          mensaje: 'Login exitoso',
          token,
          usuario: {
            id: usuario.idUsuario,
            idUsuario: usuario.idUsuario,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            perfil: usuario.rol
          }
        });
      });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al procesar el login', error: error.message });
    }
  }
};

module.exports = usuarioController;