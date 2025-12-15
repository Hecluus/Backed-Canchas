const { Schema, model } = require('mongoose');

const ComidaSchema = Schema({
    nombre: { type: String, required: true, unique: true },
    estado: { type: Boolean, default: true },
    precio: { type: Number, default: 0 },
    descripcion: { type: String },
    img: { type: String },
    destacado: { type: Boolean, default: false },
    stock: { type: Number, default: 0 },
    fechaRegistro: { type: Date, default: Date.now },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true }
});

module.exports = model('Comida', ComidaSchema);
