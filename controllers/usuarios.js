const { response, request } = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const usuariosTodosGet = async (req = request, res = response) => {
    try {
        const { desde = 0, limite = 5 } = req.query;
        const query = { estado: true };

        const [total, usuarios] = await Promise.all([
            Usuario.countDocuments(query),
            Usuario.find(query).skip(Number(desde)).limit(Number(limite))
        ]);

        res.json({ mensaje: 'Usuarios obtenidos', total, usuarios });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const usuarioGetID = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ mensaje: 'ID inválido' });
        }

        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json({ mensaje: 'Usuario obtenido', usuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const usuarioPost = async (req = request, res = response) => {
    try {
        const { nombre, apellido, correo, password, rol } = req.body;

        // Validar correo único
        const existeCorreo = await Usuario.findOne({ correo });
        if (existeCorreo) {
            return res.status(400).json({ mensaje: 'El correo ya está en uso' });
        }

        // Validar creación de admin
        if (rol === 'admin') {
            if (!req.usuario || req.usuario.rol !== 'admin') {
                return res.status(403).json({ mensaje: 'Solo un administrador puede crear otro administrador' });
            }
        }

        // Crear usuario
        const usuario = new Usuario({ nombre, apellido, correo, password, rol });
        await usuario.save();

        // Generar token JWT
        const token = jwt.sign(
            { id: usuario._id, correo: usuario.correo },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        );

        res.status(201).json({
            mensaje: 'Usuario creado correctamente',
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                rol: usuario.rol
            },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
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
