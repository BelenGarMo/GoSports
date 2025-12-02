const db = require('../config/db');

const Categoria = {
  // Obtener todas las categorías de un evento
  getByEvento: (idEvento, callback) => {
    const sql = 'SELECT * FROM categoria_evento WHERE idEvento = ? ORDER BY nombreCategoria';
    db.query(sql, [idEvento], callback);
  },

  // Obtener una categoría por ID
  getById: (idCategoria, callback) => {
    const sql = 'SELECT * FROM categoria_evento WHERE idCategoria = ?';
    db.query(sql, [idCategoria], callback);
  },

  // Crear una nueva categoría
  create: (categoria, callback) => {
    const sql = 'INSERT INTO categoria_evento SET ?';
    db.query(sql, categoria, callback);
  },

  // Actualizar una categoría
  update: (idCategoria, categoria, callback) => {
    const sql = 'UPDATE categoria_evento SET ? WHERE idCategoria = ?';
    db.query(sql, [categoria, idCategoria], callback);
  },

  // Eliminar una categoría
  delete: (idCategoria, callback) => {
    const sql = 'DELETE FROM categoria_evento WHERE idCategoria = ?';
    db.query(sql, [idCategoria], callback);
  }
};

module.exports = Categoria;