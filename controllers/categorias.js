const { request, response } = require("express");
const Categoria = require("../models/categoria");

// Crear categoría
const crearCategoria = async (req = request, res = response) => {
  try {
    const categoria = new Categoria(req.body);
    await categoria.save();
    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar categorías
const obtenerCategorias = async (req = request, res = response) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una categoría
const obtenerCategoria = async (req = request, res = response) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar categoría
const actualizarCategoria = async (req = request, res = response) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

// 👉 Exportar todas las funciones juntas
module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria
};
