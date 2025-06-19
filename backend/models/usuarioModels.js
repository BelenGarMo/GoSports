const db = require('../config/db');

// Creamos el modelo de Usuario con los métodos necesarios
const Usuario = {
  // Obtener todos los usuarios
  getAll: (callback) => {
    const query = 'SELECT * FROM usuarios';
    db.query(query, callback);
  },

  // Obtener un usuario por ID
  getById: (id, callback) => {
    const query = 'SELECT * FROM usuarios WHERE idUsuario = ?';
    db.query(query, [id], callback);
  },

  // Crear un nuevo usuario
  create: (nuevoUsuario, callback) => {
    const query = 'INSERT INTO usuarios SET ?';
    db.query(query, nuevoUsuario, callback);
  },

  // Actualizar un usuario existente
  update: (id, datosActualizados, callback) => {
    const query = 'UPDATE usuarios SET ? WHERE idUsuario = ?';
    db.query(query, [datosActualizados, id], callback);
  },

  // Eliminar un usuario
  delete: (id, callback) => {
    const query = 'DELETE FROM usuarios WHERE idUsuario = ?';
    db.query(query, [id], callback);
  }
};

module.exports = Usuario;