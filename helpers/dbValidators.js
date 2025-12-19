const Usuario = require('../models/usuario');
const Rol = require('../models/rol');
const Categoria = require('../models/categoria');
const Cancha = require('../models/cancha');
const Reserva = require('../models/reserva');

const emailExiste = async (correo) => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya se encuentra en la base de datos`);
    }
}

const esRolValido = async (rol) => {
    const existeRol = await Rol.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no existe en la base de datos!`);
    }
}

const usuarioExiste = async (id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} no corresponde a ningun usuario registrado!`);
    }
}

const categoriaExiste = async (id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id ${id} no corresponde a ninguna categoria registrada!`);
    }
}

const canchaExiste = async (id) => {
    const existeCancha = await Cancha.findById(id);
    if (!existeCancha) {
        throw new Error(`El id ${id} no corresponde a ninguna cancha registrada!`);
    }
}

const reservaExiste = async (id) => {
    const existeReserva = await Reserva.findById(id);
    if (!existeReserva) {
        throw new Error(`El id ${id} no corresponde a ninguna reserva registrada!`);
    }
}

module.exports = {
    emailExiste,
    esRolValido,
    usuarioExiste,
    categoriaExiste,
    canchaExiste,
    reservaExiste
}