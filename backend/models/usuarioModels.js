const db = require('../config/db');

const usuarios = {
  // Obtener todos los usuarioss
  getAll: (callback) => {
    db.query('SELECT * FROM usuarios', callback);
  },

  // Obtener un usuarios por ID
  getById: (id, callback) => {
    db.query('SELECT * FROM usuarios WHERE idusuarios = ?', [id], callback);
  },

  // Buscar usuarios por email (para login)
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], callback);
  },

  // Crear nuevo usuarios
  create: (datos, callback) => {
    db.query('INSERT INTO usuarios SET ?', datos, callback);
  },

  // Actualizar usuarios
  update: (id, datos, callback) => {
    db.query('UPDATE usuarios SET ? WHERE idusuarios = ?', [datos, id], callback);
  },

  // Eliminar usuarios
  delete: (id, callback) => {
    db.query('DELETE FROM usuarios WHERE idusuarios = ?', [id], callback);
  }
};

module.exports = usuarios;