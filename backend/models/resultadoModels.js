const db = require('../config/db');

// Creamos un objeto Resultado con los métodos que nos permiten interactuar con la base de datos
const Resultado = {
  // Obtener todos los resultados
  getAll: (callback) => {
    const sql = 'SELECT * FROM resultado';
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
  }
};

module.exports = Resultado;
