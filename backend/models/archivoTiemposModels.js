const db = require('../config/db');

// Creamos un objeto ArchivoTiempos con todos los métodos necesarios
const ArchivoTiempos = {
  // Obtener todos los archivos de tiempos
  getAll: (callback) => {
    const query = 'SELECT * FROM archivotiempos';
    db.query(query, callback);
  },

  // Obtener un archivo por su ID
  getById: (id, callback) => {
    const query = 'SELECT * FROM archivotiempos WHERE idArchivo = ?';
    db.query(query, [id], callback);
  },

  // Crear un nuevo archivo de tiempos
  create: (archivo, callback) => {
    const query = 'INSERT INTO archivotiempos (nombreArchivo, tipo, fechaSubida, url, idEvento) VALUES (?, ?, ?, ?, ?)';
    const valores = [archivo.nombreArchivo, archivo.tipo, archivo.fechaSubida, archivo.url, archivo.idEvento];
    db.query(query, valores, callback);
  },

  // Actualizar un archivo existente
  update: (id, archivo, callback) => {
    const query = 'UPDATE archivotiempos SET nombreArchivo = ?, tipo = ?, fechaSubida = ?, url = ?, idEvento = ? WHERE idArchivo = ?';
    const valores = [archivo.nombreArchivo, archivo.tipo, archivo.fechaSubida, archivo.url, archivo.idEvento, id];
    db.query(query, valores, callback);
  },

  // Eliminar un archivo
  delete: (id, callback) => {
    const query = 'DELETE FROM archivotiempos WHERE idArchivo = ?';
    db.query(query, [id], callback);
  }
};

module.exports = ArchivoTiempos;