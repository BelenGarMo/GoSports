const db = require('../config/db');

const inscripcionController = {
  // Crear una inscripción
  crearInscripcion: (req, res) => {
    const { idEvento, idUsuario, idCategoria, metodoPago } = req.body;

    // Verificar si ya está inscripto
    const sqlVerificar = 'SELECT * FROM inscripcion WHERE idEvento = ? AND idUsuario = ?';
    db.query(sqlVerificar, [idEvento, idUsuario], (err, resultado) => {
      if (err) {
        console.error('Error al verificar inscripción:', err);
        return res.status(500).json({ mensaje: 'Error al verificar inscripción', error: err });
      }

      if (resultado.length > 0) {
        return res.status(400).json({ mensaje: 'Ya estás inscrito en este evento' });
      }

      // Crear inscripción
      const sqlInsertar = 'INSERT INTO inscripcion (idEvento, idUsuario, idCategoria, estadoPago, metodoPago) VALUES (?, ?, ?, ?, ?)';
      db.query(sqlInsertar, [idEvento, idUsuario, idCategoria, 'pendiente', metodoPago || 'transferencia'], (err, resultado) => {
        if (err) {
          console.error('Error al crear inscripción:', err);
          return res.status(500).json({ mensaje: 'Error al crear inscripción', error: err.message });
        }
        res.status(201).json({
          mensaje: 'Inscripción creada correctamente',
          idInscripcion: resultado.insertId
        });
      });
    });
  },

  // Obtener inscriptos de un evento
  obtenerInscritosPorEvento: (req, res) => {
    const { idEvento } = req.params;
    const sql = `
      SELECT 
        i.idInscripcion,
        i.idEvento,
        i.idUsuario,
        i.idCategoria,
        i.estadoPago,
        i.metodoPago,
        u.nombre,
        u.apellido,
        u.email,
        c.nombreCategoria,
        c.genero,
        c.edadMinima,
        c.edadMaxima
      FROM inscripcion i
      INNER JOIN usuarios u ON i.idUsuario = u.idUsuario
      LEFT JOIN categoria_evento c ON i.idCategoria = c.idCategoria
      WHERE i.idEvento = ?
      ORDER BY u.apellido, u.nombre
    `;

    db.query(sql, [idEvento], (err, resultados) => {
      if (err) {
        console.error('Error al obtener inscritos:', err);
        return res.status(500).json({ mensaje: 'Error al obtener inscritos', error: err });
      }
      res.status(200).json(resultados);
    });
  },

  // Obtener inscripciones de un usuario
  obtenerInscripcionesPorUsuario: (req, res) => {
    const { idUsuario } = req.params;
    const sql = `
      SELECT 
        i.*,
        e.nombre as nombreEvento,
        e.fecha,
        e.lugar,
        e.estado as estadoEvento,
        c.nombreCategoria
      FROM inscripcion i
      INNER JOIN evento e ON i.idEvento = e.idEvento
      LEFT JOIN categoria_evento c ON i.idCategoria = c.idCategoria
      WHERE i.idUsuario = ?
      ORDER BY e.fecha DESC
    `;

    db.query(sql, [idUsuario], (err, resultados) => {
      if (err) {
        console.error('Error al obtener inscripciones:', err);
        return res.status(500).json({ mensaje: 'Error al obtener inscripciones', error: err });
      }
      res.status(200).json(resultados);
    });
  },

  // Verificar si un usuario ya está inscripto
  verificarInscripcion: (req, res) => {
    const { idEvento, idUsuario } = req.params;
    const sql = 'SELECT * FROM inscripcion WHERE idEvento = ? AND idUsuario = ?';

    db.query(sql, [idEvento, idUsuario], (err, resultado) => {
      if (err) {
        console.error('Error al verificar inscripción:', err);
        return res.status(500).json({ mensaje: 'Error al verificar inscripción', error: err });
      }
      res.status(200).json({ inscrito: resultado.length > 0 });
    });
  },

  // Actualizar inscripción
  actualizarInscripcion: (req, res) => {
    const { id } = req.params;
    const { idCategoria, estadoPago } = req.body;

    const sql = 'UPDATE inscripcion SET idCategoria = ?, estadoPago = ? WHERE idInscripcion = ?';
    db.query(sql, [idCategoria, estadoPago, id], (err) => {
      if (err) {
        console.error('Error al actualizar inscripción:', err);
        return res.status(500).json({ mensaje: 'Error al actualizar inscripción', error: err });
      }
      res.status(200).json({ mensaje: 'Inscripción actualizada correctamente' });
    });
  },

  // Eliminar inscripción
  eliminarInscripcion: (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM inscripcion WHERE idInscripcion = ?';

    db.query(sql, [id], (err) => {
      if (err) {
        console.error('Error al eliminar inscripción:', err);
        return res.status(500).json({ mensaje: 'Error al eliminar inscripción', error: err });
      }
      res.status(200).json({ mensaje: 'Inscripción eliminada correctamente' });
    });
  }
};

module.exports = inscripcionController;