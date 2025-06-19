const db = require('../config/db');

// Creamos el modelo de inscripción con funciones para interactuar con la base de datos
const Inscripcion = {
  // Obtener todas las inscripciones
  getAll: (callback) => {
    const query = 'SELECT * FROM inscripcion';
    db.query(query, callback);
  },

  // Obtener una inscripción por ID
  getById: (idInscripcion, callback) => {
    const query = 'SELECT * FROM inscripcion WHERE idInscripcion = ?';
    db.query(query, [idInscripcion], callback);
  },

  // Crear una nueva inscripción
  create: (nuevaInscripcion, callback) => {
    const query = 'INSERT INTO inscripcion SET ?';
    db.query(query, nuevaInscripcion, callback);
  },

  // Actualizar una inscripción
  update: (idInscripcion, inscripcionActualizada, callback) => {
    const query = 'UPDATE inscripcion SET ? WHERE idInscripcion = ?';
    db.query(query, [inscripcionActualizada, idInscripcion], callback);
  },

  // Eliminar una inscripción
  delete: (idInscripcion, callback) => {
    const query = 'DELETE FROM inscripcion WHERE idInscripcion = ?';
    db.query(query, [idInscripcion], callback);
  }
};

module.exports = Inscripcion;