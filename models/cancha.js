const { Schema, model } = require("mongoose");

const canchaSchema = new Schema({
    cancha: { type: Number, required: true },
    desde: { type: Number, required: true },
    hasta: { type: Number, required: true },
    precio: { type: Number, required: true },
    estado: { type: Boolean, default: true }
});

module.exports = model("Cancha", canchaSchema);
