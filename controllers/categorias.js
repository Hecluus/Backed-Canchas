const { request, response } = require("express");
const Categoria = require("../models/categoria");

// Crear categoría
const crearCategoria = async (req = request, res = response) => {
  try {
    const { nombre } = req.body;

    // Normalizar nombre (opcional)
    const nombreUpper = nombre.toUpperCase();

    // Verificar si ya existe
    const categoriaDB = await Categoria.findOne({ nombre: nombreUpper });
    if (categoriaDB) {
      return res.status(400).json({ error: `La categoría ${categoriaDB.nombre} ya existe` });
    }

    // Construir data con usuario del JWT
    const data = {
      nombre: nombreUpper,
      usuario: req.usuario._id   // 👈 viene del middleware validarJWT
    };

    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar categorías
const obtenerCategorias = async (req = request, res = response) => {
  try {
    const categorias = await Categoria.find().populate("usuario", "nombre email");
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una categoría
const obtenerCategoria = async (req = request, res = response) => {
  try {
    const categoria = await Categoria.findById(req.params.id).populate("usuario", "nombre email");
    if (!categoria) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar categoría
const actualizarCategoria = async (req = request, res = response) => {
  try {
    const { nombre } = req.body;
    const nombreUpper = nombre?.toUpperCase();

    const data = {
      nombre: nombreUpper,
      usuario: req.usuario._id // 
    };

    const categoria = await Categoria.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!categoria) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar categoría
const eliminarCategoria = async (req = request, res = response) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json({ mensaje: "Categoría eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria
};
