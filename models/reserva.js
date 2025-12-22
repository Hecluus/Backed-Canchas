const { Schema, model } = require("mongoose");

const reservaSchema = new Schema({
    cancha: { type: Schema.Types.ObjectId, ref: "Cancha" },
    fecha: { type: Date, required: true },
    hora: { type: Number, required: true },
    usuario: { type: String, required: true },
    estado: { type: Boolean, default: true },
    fechaRegistro: { type: Date, default: Date.now }
});

reservaSchema.index({ fecha: 1 });

module.exports = model("Reserva", reservaSchema);