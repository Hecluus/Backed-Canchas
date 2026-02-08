const { request, response } = require("express");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const client = new MercadoPagoConfig({ accessToken: 'APP_USR-3869196553863656-012720-559d9c6874a91e529966453814d9c169-3164094868' });

const crearPreferencia = async (req = request, res = response) => {
    const preference = new Preference(client);

    const { title, quantity, unit_price } = req.body.items[0];

    preference.create({
        body: {
            items: [
                {
                    title: title,
                    quantity: quantity,
                    unit_price: unit_price
                }
            ],
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