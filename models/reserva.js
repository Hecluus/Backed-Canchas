const { Schema, model } = require("mongoose");

const reservaSchema = new Schema({
    cancha: { type: Schema.Types.ObjectId, ref: "Cancha" },
    fecha: { type: Date, required: true }, /*{ type: String, required: true }*/
    hora: { type: Number, required: true },
});

module.exports = model("Reserva", reservaSchema);