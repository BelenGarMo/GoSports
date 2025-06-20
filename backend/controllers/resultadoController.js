const Resultado = require('../models/resultadoModels');

// Creamos un objeto controlador con todas las funciones necesarias
const resultadoController = {
  // Obtener todos los resultados
  obtenerResultados: (req, res) => {
    Resultado.getAll((err, resultados) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener resultados', error: err });
      }
      res.status(200).json(resultados);
    });
  },

   // Obtener los resultados de un evento específico
  obtenerResultadosPorEvento: (req, res) => {
    const idEvento = req.params.idEvento;
    Resultado.getByEvento(idEvento, (err, resultados) => {
      if (err) {
        return res
          .status(500)
          .json({ mensaje: 'Error al obtener resultados', error: err });
      }
      res.status(200).json(resultados);
    });
  },
  
   // Obtener un resultado por ID
  obtenerResultadoPorId: (req, res) => {
    const id = req.params.id;
    Resultado.getById(id, (err, resultado) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener el resultado', error: err });
      }
      if (resultado.length === 0) {
        return res.status(404).json({ mensaje: 'Resultado no encontrado' });
      }
      res.status(200).json(resultado[0]);
    });
  },

  // Crear un nuevo resultado
  crearResultado: (req, res) => {
    const nuevoResultado = req.body;
    Resultado.create(nuevoResultado, (err, resultado) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al crear resultado', error: err });
      }
      res.status(201).json({ mensaje: 'Resultado creado correctamente', idInsertado: resultado.insertId });
    });
  },

  // Actualizar un resultado existente
  actualizarResultado: (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;
    Resultado.update(id, datosActualizados, (err) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al actualizar resultado', error: err });
      }
      res.status(200).json({ mensaje: 'Resultado actualizado correctamente' });
    });
  },

  // Eliminar un resultado
  eliminarResultado: (req, res) => {
    const id = req.params.id;
    Resultado.delete(id, (err) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al eliminar resultado', error: err });
      }
      res.status(200).json({ mensaje: 'Resultado eliminado correctamente' });
    });
  }
};

module.exports = resultadoController;