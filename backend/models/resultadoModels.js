const db = require('../config/db');

// Creamos un objeto Resultado con los métodos que nos permiten interactuar con la base de datos
const Resultado = {
  // Obtener todos los resultados con datos de evento y corredor
  getAll: (callback) => {
    const sql = `SELECT r.idResultado, r.idEvento, e.nombre AS nombreEvento,
                        r.idUsuario, u.nombre, u.apellido,
                        r.tiempoOficial, r.posicionGeneral, r.posicionCategoria
                 FROM resultado AS r
                 JOIN usuarios AS u ON r.idUsuario = u.idUsuario
                 JOIN evento AS e ON r.idEvento = e.idEvento
                 ORDER BY r.idEvento, r.posicionGeneral`;
    db.query(sql, callback);
  },

  // Obtener un resultado por su ID
  getById: (idResultado, callback) => {
    const sql = 'SELECT * FROM resultado WHERE idResultado = ?';
    db.query(sql, [idResultado], callback);
  },

  // Crear un nuevo resultado
  create: (nuevoResultado, callback) => {
    const sql = 'INSERT INTO resultado SET ?';
    db.query(sql, nuevoResultado, callback);
  },

  // Actualizar un resultado existente
  update: (idResultado, datosActualizados, callback) => {
    const sql = 'UPDATE resultado SET ? WHERE idResultado = ?';
    db.query(sql, [datosActualizados, idResultado], callback);
  },

  // Eliminar un resultado
  delete: (idResultado, callback) => {
    const sql = 'DELETE FROM resultado WHERE idResultado = ?';
    db.query(sql, [idResultado], callback);
  },

  // Obtener resultados de un evento específico con nombres de corredor
  getByEvento: (idEvento, callback) => {
    const sql = `SELECT r.idResultado, r.idEvento, e.nombre AS nombreEvento,
                        r.idUsuario, u.nombre, u.apellido,
                        r.tiempoOficial, r.posicionGeneral, r.posicionCategoria
                 FROM resultado AS r
                 JOIN usuarios AS u ON r.idUsuario = u.idUsuario
                 JOIN evento AS e ON r.idEvento = e.idEvento
                 WHERE r.idEvento = ?
                 ORDER BY r.posicionGeneral`;
    db.query(sql, [idEvento], callback);
  }
};

module.exports = Resultado;