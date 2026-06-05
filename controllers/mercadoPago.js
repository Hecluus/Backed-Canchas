const { request, response } = require("express");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

const crearPreferencia = async (req = request, res = response) => {
    const preference = new Preference(client);

    const { items, metadata } = req.body;

    const itemsFormateados = items.map(item => ({
        title: item.title,
        quantity: item.quantity || 1,
        unit_price: item.unit_price
    }));

    const metadataFormateada = { ...metadata };
    const backendUrl = process.env.BACKEND_VERCEL_URL;

    preference.create({
        body: {
            items: itemsFormateados,
            metadata: metadataFormateada,
            back_urls: {
                success: `${backendUrl}/api/create-preference/redirect?status=exitoso&tipo=${metadataFormateada.tipo}`,
                failure: `${backendUrl}/api/create-preference/redirect?status=fallido&tipo=${metadataFormateada.tipo}`,
                pending: `${backendUrl}/api/create-preference/redirect?status=pendiente&tipo=${metadataFormateada.tipo}`
            },
            notification_url: `${backendUrl}/api/webhook/webhook`,
        }
    })
        .then((data) => {
            console.log("Preferencia creada:", data.id);
            res.status(200).json({
                preference_id: data.id,
                preference_url: data.init_point
            })
        })
        .catch((error) => {
            console.error("Error MercadoPago:", error);
            res.status(500).json({ "error": "error al crear la preferencia", "detalles": error })
        });
}

const redirigir = (req, res) => {
    const { status, tipo } = req.query;

    if (tipo === 'comida') {
        res.redirect(`https://golazogourmett.netlify.app/menu?pago=${status}`);
    } else {
        res.redirect(`https://golazogourmett.netlify.app/tienda?pago=${status}`);
    }
}

module.exports = {
    crearPreferencia,
    redirigir
}