const { response, request } = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const usuariosTodosGet = async (req = request, res = response) => {
    const { desde = 0, limite = 5 } = req.query;
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).skip(desde).limit(limite).select('-password -rol')
    ]);

    res.json({
        mensaje: 'Usuarios obtenidos',
        total,
        usuarios
    });
};

const usuarioGetID = async (req = request, res = response) => {
    const { id } = req.params;

    const usuario = await Usuario.findById(id).select('-password -rol');

    res.json({
        mensaje: 'Usuario obtenido',
        usuario
    });
};

const usuarioPost = async (req = request, res = response) => {
    const datos = req.body;
    const { nombre, apellido, correo, password } = datos;
    const usuario = new Usuario({ nombre, apellido, correo, password });
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    usuario.password = hash;

    await usuario.save();

    res.json({
        mensaje: 'Usuario cargado correctamente',
        usuario
    });
};

const usuarioPut = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { password, correo, ...resto } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ mensaje: 'ID inválido' });
        }

        if (password) {
            resto.password = password;
        }

        if (correo) {
            const existeCorreo = await Usuario.findOne({ correo });
            if (existeCorreo && existeCorreo._id.toString() !== id) {
                return res.status(400).json({ mensaje: 'El correo ya está en uso' });
            }
            resto.correo = correo;
        }

        const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true, runValidators: true });
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json({ mensaje: 'Usuario actualizado correctamente', usuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const usuarioDelete = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ mensaje: 'ID inválido' });
        }

        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (!usuario.estado) {
            return res.json({ mensaje: 'Usuario ya estaba inhabilitado' });
        }

        const usuarioInhabilitado = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });
        res.json({ mensaje: 'Usuario inhabilitado exitosamente!', usuarioInhabilitado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = {
    usuariosTodosGet,
    usuarioGetID,
    usuarioPost,
    usuarioPut,
    usuarioDelete
};
