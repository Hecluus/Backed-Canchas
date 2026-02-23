const { Schema, model } = require("mongoose");

const pedidoSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, required: true, ref: "Usuario" },
    nombreUsuario: { type: String, required: true },
    items: [{
        comidaId: { type: Schema.Types.ObjectId, ref: "Comida" },
        nombre: { type: String, required: true },
        cantidad: { type: Number, required: true },
        precioUnitario: { type: Number, required: true },
        subtotal: { type: Number, required: true },
        tipo: { type: String, default: "comida" },
    }],
    total: { type: Number, required: true },
    entregado: { type: Boolean, default: false },
    fecha: { type: Date, default: Date.now },
    estado: { type: Boolean, default: true }
});

pedidoSchema.index({ usuario: 1 });
pedidoSchema.index({ fecha: -1 });
pedidoSchema.index({ entregado: 1 });

module.exports = model("Pedido", pedidoSchema);
