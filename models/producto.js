const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: { type: String, required: true, unique: true },
    estado: { type: Boolean, default: true },
    precio: { type: Number, required: true },
    descripcion: { type: String },
    img: { type: String },
    categoria: { type: String, required: true },
    stock: { type: Number, default: 0 },
    fechaRegistro: { type: Date, default: Date.now },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

module.exports = model('Producto', ProductoSchema);
