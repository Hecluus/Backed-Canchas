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
    rol: { type: String, enum: ['admin', 'user'], default: 'user' },
    img: { type: String, default: 'default.png' },
    fechaRegistro: { type: Date, default: Date.now },
    estado: { type: Boolean, default: true }
});

// Middleware para hashear contraseña antes de guardar
UsuarioSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas (login)
UsuarioSchema.methods.compararPassword = async function (passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password);
};

// Método para cambiar contraseña
UsuarioSchema.methods.cambiarPassword = async function (nuevaPassword) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(nuevaPassword, salt);
    await this.save();
};

module.exports = model('Usuario', UsuarioSchema);
