const db = require('../config/db');

const usuarios = {
  // Obtener todos los usuarios
  getAll: (callback) => {
    db.query('SELECT * FROM usuarios', callback);
  },

  // Obtener un usuario por ID
  getById: (id, callback) => {
    db.query('SELECT * FROM usuarios WHERE idUsuario = ?', [id], callback);
  },

  // Buscar usuario por email (para login)
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], callback);
  },

  // Crear nuevo usuario
  create: (datos, callback) => {
    db.query('INSERT INTO usuarios SET ?', datos, callback);
  },

  // Actualizar usuario
  update: (id, datos, callback) => {
    db.query('UPDATE usuarios SET ? WHERE idUsuario = ?', [datos, id], callback);
  },

  // Eliminar usuario
  delete: (id, callback) => {
    db.query('DELETE FROM usuarios WHERE idUsuario = ?', [id], callback);
  }
};

module.exports = usuarios;