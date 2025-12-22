const { request, response } = require("express");
const Comida = require("../models/comida");

// Crear comida
const crearComida = async (req = request, res = response) => {
  try {
    const comida = new Comida(req.body);
    await comida.save();

    // devolver populada
    const comidaPopulada = await Comida.findById(comida._id)
      .populate("categoria")
      .populate("usuario");

    res.status(201).json(comidaPopulada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar comidas
const obtenerComidas = async (req = request, res = response) => {
  try {
    const comidas = await Comida.find()
      .populate("categoria")
      .populate("usuario");
    res.json(comidas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una comida
const obtenerComida = async (req = request, res = response) => {
  try {
    const comida = await Comida.findById(req.params.id)
      .populate("categoria")
      .populate("usuario");
    if (!comida) return res.status(404).json({ error: "Comida no encontrada" });
    res.json(comida);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar comida
const actualizarComida = async (req = request, res = response) => {
  try {
    const comida = await Comida.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("categoria")
      .populate("usuario");

    if (!comida) return res.status(404).json({ error: "Comida no encontrada" });
    res.json(comida);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar comida
const eliminarComida = async (req = request, res = response) => {
  try {
    const comida = await Comida.findByIdAndDelete(req.params.id);
    if (!comida) return res.status(404).json({ error: "Comida no encontrada" });
    res.json({ mensaje: "Comida eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearComida,
  obtenerComidas,
  obtenerComida,
  actualizarComida,
  eliminarComida
};
