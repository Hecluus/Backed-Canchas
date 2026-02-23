const { request, response } = require("express");
const { MercadoPagoConfig, Payment } = require("mercadopago");
const Reserva = require("../models/reserva")

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

const recibirWebhook = async (req = request, res = response) => {
  try {
    const pagoId = req.query['data.id'] || req.query['id'];
    const tipo = req.query.topic || req.query.type;

    if (tipo === 'payment' && pagoId) {
      const pago = new Payment(client);
      const pagoData = await pago.get({ id: pagoId });

      console.log('Estado del pago:', pagoData.status);

      if (pagoData.status === 'approved') {
        const { metadata } = pagoData;

        const reservaExistente = await Reserva.findOne({
          cancha: metadata.cancha_id,
          fecha: metadata.fecha_reserva,
          hora: metadata.hora_reserva,
          usuario: metadata.usuario_id
        });

        if (!reservaExistente) {
          const nuevaReserva = new Reserva({
            cancha: metadata.cancha_id,
            fecha: metadata.fecha_reserva,
            hora: metadata.hora_reserva,
            usuario: metadata.usuario_id
          });
          
          await nuevaReserva.save();
          console.log("Reserva pagada y guardada");
        } else {
          console.log("Reserva ya existe, no se duplica");
        }
      }
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

module.exports = {
  recibirWebhook
}