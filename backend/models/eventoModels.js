const db = require('../config/db');

// Creamos un objeto para manejar las consultas relacionadas a eventos
const Evento = {
  // Obtener todos los eventos
  obtenerTodos: (callback) => {
    const sql = 'SELECT * FROM evento';
    db.query(sql, callback);
  },

  // Obtener un evento por su ID
  obtenerPorId: (id, callback) => {
    const sql = 'SELECT * FROM evento WHERE idEvento = ?';
    db.query(sql, [id], callback);
  },

  // Crear un nuevo evento
  crear: (nuevoEvento, callback) => {
    const sql = 'INSERT INTO evento SET ?';
    db.query(sql, nuevoEvento, callback);
  },

  // Actualizar un evento
  actualizar: (id, datosActualizados, callback) => {
    const sql = 'UPDATE evento SET ? WHERE idEvento = ?';
    db.query(sql, [datosActualizados, id], callback);
  },

  // Eliminar un evento
  eliminar: (id, callback) => {
    const sql = 'DELETE FROM evento WHERE idEvento = ?';
    db.query(sql, [id], callback);
  }
};

module.exports = Evento;
