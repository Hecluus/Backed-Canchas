const { Schema, model } = require("mongoose")

const comentarioSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, required: true, ref: "Usuario" },
    contenido: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    estado: { type: Boolean, default: true }
});

module.exports = model("Comentario", comentarioSchema);