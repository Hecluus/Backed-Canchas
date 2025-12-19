const { Schema, model } = require("mongoose");

const canchaSchema = new Schema({
    canchas: { type: Number, required: true },
    desde: { type: Number, required: true },
    hasta: { type: Number, required: true },
    estado: { type: Boolean, default: true },
    fechaRegistro: { type: Date, default: Date.now }
});

module.exports = model("Cancha", canchaSchema);
