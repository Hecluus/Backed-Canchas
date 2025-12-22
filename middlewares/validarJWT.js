const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({ msg: "No hay token en la petición" });
    }

    try {
        // Verificar el token y obtener el uid
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({ msg: "Token no válido - usuario no existe" });
        }

        if (!usuario.estado) {
            return res.status(401).json({ msg: "Token no válido - usuario inactivo" });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.error("Error al verificar token:", error.message);
        res.status(401).json({ msg: "Token no válido" });
    }
};

module.exports = { validarJWT };
