const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');
const { enviarEmail } = require('../helpers/enviarCorreo');

const login = async (req = request, res = response) => {
    const { correo, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Correo o password incorrectos | usuario inexistente'
            })
        }

        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Correo o password incorrectos | usuario inactivo'
            })
        }

        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Correo o password incorrectos | password erróneo'
            })
        }

        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Login OK',
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador del sistema'
        })
    }
}

const recuperarContrasenia = async (req = request, res = response) => {
    try {
        const { correo } = req.body;
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({
                msg: 'No existe el correo'
            })
        }

        const token = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY + usuario.password, { expiresIn: '30m' });

        const link = `https://golazogourmett.netlify.app/recuperarContrasenia/${usuario.id}/${token}`;

        await enviarEmail(correo, link);

        res.json({
            msg: 'Email enviado'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Ocurrio un problema al enviar el email'
        })
    }
};

const cambiarContrasenia = async (req = request, res = response) => {
    try {
        const { id, token } = req.params;
        const { password } = req.body;
        const usuario = await Usuario.findById(id);

        if (!usuario || !usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario no esta disponible'
            })
        }

        const secret = process.env.SECRET_KEY + usuario.password;

        jwt.verify(token, secret);

        const salt = bcrypt.genSaltSync(10);
        const nuevaContrasenia = bcrypt.hashSync(password, salt)

        await Usuario.findByIdAndUpdate(id, { password: nuevaContrasenia }, { new: true });

        res.json({
            msg: 'Se cambio la contraseña'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Ocurrio un problema al cambiar la contraseña'
        })
    }
}

module.exports = {
    login,
    recuperarContrasenia,
    cambiarContrasenia
}