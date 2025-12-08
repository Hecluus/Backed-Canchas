const { request, response } = require("express");
const Reserva = require("../models/reserva");

const reservasTodasGet = async (req = request, res = response) => {
    const { desde = 0, limite = 10 } = req.query;
    const query = { estado: true };

    const [total, reservas] = await Promise.all([
        Reserva.countDocuments(query),
        Reserva.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    res.json({
        total,
        reservas,
        msg: "todas las reservas obtenidas"
    });
}

const reservaGet = async (req = request, res = response) => {
    const { id } = req.params;
    const reserva = await Reserva.findById(id);
    res.json({
        reserva,
        msg: "reserva obtenida"
    });
}

const reservaPost = async (req = request, res = response) => {
    const { cancha, fecha, hora } = req.body;
    const reserva = new Reserva({ cancha, fecha, hora });

    await reserva.save();

    res.json({
        reserva,
        msg: "reserva creada"
    });

}

const reservaPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { cancha, fecha, hora } = req.body;
    const reserva = await Reserva.findById(id);

    reserva.cancha = cancha;
    reserva.fecha = fecha;
    reserva.hora = hora;

    await reserva.save();

    res.json({
        reserva,
        msg: "reserva del usuario actualizada"
    });
}

const reservaDelete = async (req = request, res = response) => {
    const { id } = req.params;
    const reserva = await Reserva.findByIdAndDelete(id, { estado: false }, { new: true });

    res.json({
        reserva,
        msg: "reserva del usuario eliminada"
    });
}

module.exports = {
    reservasTodasGet,
    reservaGet,
    reservaPost,
    reservaPut,
    reservaDelete
}
