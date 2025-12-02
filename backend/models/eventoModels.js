const db = require('../config/db');

const Evento = {
  // Obtener todos los eventos
  obtenerTodos: (callback) => {
    const sql = 'SELECT * FROM evento ORDER BY fecha DESC';
    db.query(sql, callback);
  },

  // Obtener eventos por creador
  obtenerPorCreador: (idCreador, callback) => {
    const sql = 'SELECT * FROM evento WHERE idCreador = ? ORDER BY fecha DESC';
    db.query(sql, [idCreador], callback);
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
    // Remover campos que no deben actualizarse
    delete datosActualizados.idUsuario;
    delete datosActualizados.perfil;
    delete datosActualizados.idCreador; // El creador no cambia
    
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