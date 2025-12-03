const db = require('../config/db');

const resultadoController = {
  // Crear un resultado
  crearResultado: (req, res) => {
    const { idEvento, idUsuario, idCategoria, tiempoOficial, posicionGeneral, posicionCategoria } = req.body;

    const sql = `
      INSERT INTO resultado 
      (idEvento, idUsuario, idCategoria, tiempoOficial, posicionGeneral, posicionCategoria) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.query(
      sql, 
      [idEvento, idUsuario, idCategoria, tiempoOficial, posicionGeneral, posicionCategoria],
      (err, resultado) => {
        if (err) {
          return res.status(500).json({ mensaje: 'Error al crear resultado', error: err });
        }
        res.status(201).json({ 
          mensaje: 'Resultado creado correctamente', 
          idResultado: resultado.insertId 
        });
      }
    );
  },

  // Obtener resultados de un evento (CON DATOS DE CATEGORÍA)
  obtenerResultadosPorEvento: (req, res) => {
    const { idEvento } = req.params;
    const sql = `
      SELECT 
        r.idResultado,
        r.idEvento,
        r.idUsuario,
        r.idCategoria,
        r.tiempoOficial,
        r.posicionGeneral,
        r.posicionCategoria,
        u.nombre,
        u.apellido,
        u.email,
        c.nombreCategoria,
        c.genero,
        c.edadMinima,
        c.edadMaxima
      FROM resultado r
      INNER JOIN usuarios u ON r.idUsuario = u.idUsuario
      LEFT JOIN categoria_evento c ON r.idCategoria = c.idCategoria
      WHERE r.idEvento = ?
      ORDER BY r.posicionGeneral ASC
    `;
    
    db.query(sql, [idEvento], (err, resultados) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener resultados', error: err });
      }
      res.status(200).json(resultados);
    });
  },

  // Obtener resultados por categoría
  obtenerResultadosPorCategoria: (req, res) => {
    const { idEvento, idCategoria } = req.params;
    const sql = `
      SELECT 
        r.*,
        u.nombre,
        u.apellido,
        c.nombreCategoria
      FROM resultado r
      INNER JOIN usuarios u ON r.idUsuario = u.idUsuario
      LEFT JOIN categoria_evento c ON r.idCategoria = c.idCategoria
      WHERE r.idEvento = ? AND r.idCategoria = ?
      ORDER BY r.posicionCategoria ASC
    `;
    
    db.query(sql, [idEvento, idCategoria], (err, resultados) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener resultados', error: err });
      }
      res.status(200).json(resultados);
    });
  },

  // Obtener resultados de un usuario
  obtenerResultadosPorUsuario: (req, res) => {
    const { idUsuario } = req.params;
    const sql = `
      SELECT 
        r.*,
        e.nombre as nombreEvento,
        e.fecha,
        e.lugar,
        c.nombreCategoria
      FROM resultado r
      INNER JOIN evento e ON r.idEvento = e.idEvento
      LEFT JOIN categoria_evento c ON r.idCategoria = c.idCategoria
      WHERE r.idUsuario = ?
      ORDER BY e.fecha DESC
    `;
    
    db.query(sql, [idUsuario], (err, resultados) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener resultados', error: err });
      }
      res.status(200).json(resultados);
    });
  },

  // Obtener un resultado específico
  obtenerResultadoPorId: (req, res) => {
    const { id } = req.params;
    const sql = `
      SELECT 
        r.*,
        u.nombre,
        u.apellido,
        e.nombre as nombreEvento,
        c.nombreCategoria
      FROM resultado r
      INNER JOIN usuarios u ON r.idUsuario = u.idUsuario
      INNER JOIN evento e ON r.idEvento = e.idEvento
      LEFT JOIN categoria_evento c ON r.idCategoria = c.idCategoria
      WHERE r.idResultado = ?
    `;
    
    db.query(sql, [id], (err, resultado) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener resultado', error: err });
      }
      if (resultado.length === 0) {
        return res.status(404).json({ mensaje: 'Resultado no encontrado' });
      }
      res.status(200).json(resultado[0]);
    });
  },

  // Actualizar un resultado
  actualizarResultado: (req, res) => {
    const { id } = req.params;
    const { tiempoOficial, posicionGeneral, posicionCategoria, idCategoria } = req.body;
    
    const sql = `
      UPDATE resultado 
      SET tiempoOficial = ?, posicionGeneral = ?, posicionCategoria = ?, idCategoria = ?
      WHERE idResultado = ?
    `;
    
    db.query(
      sql, 
      [tiempoOficial, posicionGeneral, posicionCategoria, idCategoria, id],
      (err) => {
        if (err) {
          return res.status(500).json({ mensaje: 'Error al actualizar resultado', error: err });
        }
        res.status(200).json({ mensaje: 'Resultado actualizado correctamente' });
      }
    );
  },

  // Eliminar un resultado
  eliminarResultado: (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM resultado WHERE idResultado = ?';
    
    db.query(sql, [id], (err) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al eliminar resultado', error: err });
      }
      res.status(200).json({ mensaje: 'Resultado eliminado correctamente' });
    });
  },

  // Obtener estadísticas de un evento
  obtenerEstadisticas: (req, res) => {
    const { idEvento } = req.params;
    const sql = `
      SELECT 
        COUNT(*) as totalParticipantes,
        AVG(TIME_TO_SEC(tiempoOficial)) as promedioSegundos,
        MIN(tiempoOficial) as mejorTiempo,
        MAX(tiempoOficial) as peorTiempo,
        COUNT(DISTINCT idCategoria) as totalCategorias
      FROM resultado
      WHERE idEvento = ?
    `;
    
    db.query(sql, [idEvento], (err, resultado) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener estadísticas', error: err });
      }
      res.status(200).json(resultado[0]);
    });
  }
};

module.exports = resultadoController;