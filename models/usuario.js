const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    apellido: { type: String, required: [true, 'El apellido es obligatorio'] },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Formato de correo inválido']
    },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    rol: { type: String, required: [true, 'El rol es obligatorio'], default: "user" },
    img: { type: String },
    fechaRegistro: { type: Date, default: Date.now },
    estado: { type: Boolean, default: true }
});

UsuarioSchema.methods.toJSON = function () {
    const { password, __v, ...usuario } = this.toObject();
    return usuario;
};

module.exports = model('Usuario', UsuarioSchema);
