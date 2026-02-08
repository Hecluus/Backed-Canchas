const { Schema, model } = require("mongoose");

const pedidoSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, required: true, ref: "Usuario" },
    productos: [{
        comida: { type: Schema.Types.ObjectId, required: true, ref: "Comida" },
        cantidad: { type: Number, required: true },
        precio: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    fecha: { type: Date, default: Date.now }
});

module.exports = model("Pedido", pedidoSchema);