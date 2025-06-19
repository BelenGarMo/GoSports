const db = require('../config/db');

const Notificacion = {
  // Obtener todas las notificaciones
  getAll: (callback) => {
    const sql = 'SELECT * FROM notificacion';
    db.query(sql, callback);
  },

  // Obtener una notificación por ID
  getById: (id, callback) => {
    const sql = 'SELECT * FROM notificacion WHERE idNotificacion = ?';
    db.query(sql, [id], callback);
  },

  // Crear una nueva notificación
  create: (nuevaNotificacion, callback) => {
    const sql = 'INSERT INTO notificacion SET ?';
    db.query(sql, nuevaNotificacion, callback);
  },

  // Actualizar una notificación existente
  update: (id, datosActualizados, callback) => {
    const sql = 'UPDATE notificacion SET ? WHERE idNotificacion = ?';
    db.query(sql, [datosActualizados, id], callback);
  },

  // Eliminar una notificación
  delete: (id, callback) => {
    const sql = 'DELETE FROM notificacion WHERE idNotificacion = ?';
    db.query(sql, [id], callback);
  }
};

module.exports = Notificacion;