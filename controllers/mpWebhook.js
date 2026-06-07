const { request, response } = require("express");
const { MercadoPagoConfig, Payment } = require("mercadopago");
const Reserva = require("../models/reserva")
const Pedido = require("../models/pedido")
const Producto = require("../models/producto")

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

const recibirWebhook = async (req = request, res = response) => {
  try {
    const pagoId = req.query['data.id'] || req.query['id'] || req.body?.data?.id;
    const tipo = req.query.topic || req.query.type || req.body?.type || req.body?.action;
    if ((tipo === 'payment' || tipo === 'payment.created') && pagoId) {
      const pago = new Payment(client);
      const pagoData = await pago.get({ id: pagoId });
      if (pagoData.status === 'approved') {
        const { metadata } = pagoData;
        if (metadata.tipo === 'tienda' || metadata.tipo === 'comida') {
          const pedidoExistente = await Pedido.findOne({ pago_id: pagoData.id?.toString() });
          if (!pedidoExistente) {
            const items = JSON.parse(metadata.items_json);
            const pedido = new Pedido({
              usuario: metadata.usuario_id,
              nombreUsuario: metadata.nombre_usuario,
              items: items.map(item => ({
                productoId: metadata.tipo === 'tienda' ? (item.productoId || item._id) : undefined,
                comidaId: metadata.tipo === 'comida' ? (item.productoId || item._id) : undefined,
                nombre: item.nombre,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario,
                subtotal: item.subtotal,
                tipo: metadata.tipo
              })),
              total: metadata.total,
              pago_id: pagoData.id?.toString(),
              entregado: false
            });
            await pedido.save();
            console.log(`✅ Pedido de ${metadata.tipo} pagado y guardado`);

            if (metadata.tipo === 'tienda') {
              for (const item of items) {
                await Producto.findByIdAndUpdate(item.productoId || item._id, {
                  $inc: { stock: -item.cantidad }
                });
              }
            }
          }
        } else if (metadata.tipo === 'reserva') {
          const horaFormateada = parseInt(metadata.hora_reserva);
          const reservaExistente = await Reserva.findOne({
            cancha: metadata.cancha_id,
            fecha: metadata.fecha_reserva,
            hora: horaFormateada,
            usuario: metadata.usuario_id
          });
          if (!reservaExistente) {
            const nuevaReserva = new Reserva({
              cancha: metadata.cancha_id,
              fecha: metadata.fecha_reserva,
              hora: horaFormateada,
              usuario: metadata.usuario_id
            });

            await nuevaReserva.save();
          }
        }
      }
    }
    res.sendStatus(204);
  } catch (error) {
    console.error("Error en Webhook:", error);
    return res.sendStatus(500);
  }
};

module.exports = {
  recibirWebhook
}