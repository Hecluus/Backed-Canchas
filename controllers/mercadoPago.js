const { request, response } = require("express");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

const crearPreferencia = async (req = request, res = response) => {
    const preference = new Preference(client);

    const { title, quantity, unit_price } = req.body.items[0];
    const { metadata } = req.body;

    preference.create({
        body: { 
            items: [
                {
                    title: title,
                    quantity: quantity,
                    unit_price: unit_price
                }
            ],
            metadata: {
                cancha_id: metadata.cancha_id,
                fecha_reserva: metadata.fecha_reserva,
                hora_reserva: metadata.hora_reserva,
                usuario_id: metadata.usuario_id
            },
            notification_url: `${process.env.BACKEND_VERCEL_URL}webhook`,
        }
    })
        .then((data) => {
            console.log(data);
            res.status(200).json({
                preference_id: data.id,
                preference_url: data.init_point
            })
        })
        .catch(() => {
            res.status(500).json({ "error": "error al crear la preferencia" })
        });
}

module.exports = {
    crearPreferencia
}