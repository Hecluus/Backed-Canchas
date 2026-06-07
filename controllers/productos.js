const { request, response } = require("express");
const Producto = require("../models/producto");

const crearProducto = async (req = request, res = response) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();

    const productoPopulado = await Producto.findById(producto._id)
      .populate("usuario");

    res.status(201).json(productoPopulado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const obtenerProductos = async (req = request, res = response) => {
  try {
    const productos = await Producto.find()
      .populate("usuario");
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerProducto = async (req = request, res = response) => {
  try {
    const producto = await Producto.findById(req.params.id)
      .populate("usuario");
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarProducto = async (req = request, res = response) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("usuario");

    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const eliminarProducto = async (req = request, res = response) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto
};
