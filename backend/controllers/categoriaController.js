const Categoria = require('../models/categoriaModels');

const categoriaController = {
  // Obtener categorías de un evento
  obtenerPorEvento: (req, res) => {
    const { idEvento } = req.params;
    Categoria.getByEvento(idEvento, (err, resultados) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener categorías', error: err });
      }
      res.status(200).json(resultados);
    });
  },

  // Obtener una categoría por ID
  obtenerPorId: (req, res) => {
    const { id } = req.params;
    Categoria.getById(id, (err, resultado) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al obtener categoría', error: err });
      }
      if (resultado.length === 0) {
        return res.status(404).json({ mensaje: 'Categoría no encontrada' });
      }
      res.status(200).json(resultado[0]);
    });
  },

  // Crear una nueva categoría
  crearCategoria: (req, res) => {
    const nuevaCategoria = req.body;
    Categoria.create(nuevaCategoria, (err, resultado) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al crear categoría', error: err });
      }
      res.status(201).json({ 
        mensaje: 'Categoría creada correctamente', 
        idCategoria: resultado.insertId 
      });
    });
  },

  // Actualizar una categoría
  actualizarCategoria: (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;
    Categoria.update(id, datosActualizados, (err) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al actualizar categoría', error: err });
      }
      res.status(200).json({ mensaje: 'Categoría actualizada correctamente' });
    });
  },

  // Eliminar una categoría
  eliminarCategoria: (req, res) => {
    const { id } = req.params;
    Categoria.delete(id, (err) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al eliminar categoría', error: err });
      }
      res.status(200).json({ mensaje: 'Categoría eliminada correctamente' });
    });
  }
};

module.exports = categoriaController;