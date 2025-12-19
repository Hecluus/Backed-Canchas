const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], unique: true },
    descripcion: { type: String },
    estado: { type: Boolean, default: true }, // activa/inactiva
    fechaRegistro: { type: Date, default: Date.now },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true } // quién creó la categoría
});

module.exports = model('Categoria', CategoriaSchema);
