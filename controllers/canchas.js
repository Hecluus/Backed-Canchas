const { request, response } = require("express");
const Cancha = require("../models/cancha");
const Reserva = require("../models/reserva");

const canchasTodasGet = async (req = request, res = response) => {
    const { desde = 0, limite = 5 } = req.query;
    const query = { estado: true };

    const [total, canchas] = await Promise.all([
        Cancha.countDocuments(query),
        Cancha.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        canchas,
        msg: "canchasTodasGet"
    });
}

const canchaGet = async (req = request, res = response) => {
    const { id } = req.params;
    const cancha = await Cancha.findById(id);
    res.json({
        cancha,
        msg: "canchaGet"
    });
}

const canchaPost = async (req = request, res = response) => {
    const { cancha, desde, hasta, precio } = req.body;
    const nuevaCancha = new Cancha({ cancha, desde, hasta, precio });

    if (cancha == 0) {
        return res.status(400).json({
            msg: "el numero de las chanchas deben ser mayores a 0"
        });
    }

    await nuevaCancha.save();
    res.json({
        nuevaCancha,
        msg: "canchaPost"
    });
}

const canchaPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { cancha, desde, hasta, precio } = req.body;
    const canchaActualizada = await Cancha.findById(id);

    canchaActualizada.cancha = cancha;
    canchaActualizada.desde = desde;
    canchaActualizada.hasta = hasta;
    canchaActualizada.precio = precio;

    await canchaActualizada.save();

    res.json({
        canchaActualizada,
        msg: "cancha actualizada"
    });
}

const canchaDelete = async (req = request, res = response) => {
    const { id } = req.params;
    const canchaBorrada = await Cancha.findByIdAndDelete(id, { estado: false }, { new: true });
    res.json({
        canchaBorrada,
        msg: "cancha esta inactivada"
    });
}

const obtenerHorasDisponibles = async (req, res) => {
    const { id } = req.params;
    const { fecha } = req.query;
    try {
        const cancha = await Cancha.findById(id);
        if (!cancha) {
            return res.status(404).json({ msg: 'Cancha no encontrada' });
        }

        const fechaInicio = new Date(fecha);
        const fechaFin = new Date(fecha);
        fechaFin.setDate(fechaFin.getDate() + 1);
        const reservas = await Reserva.find({
            cancha: id,
            estado: true,
            fecha: {
                $gte: fechaInicio,
                $lt: fechaFin
            }
        });
        const horasOcupadas = reservas.map(r => r.hora);
        const horasDisponibles = [];
        for (let hora = cancha.desde; hora <= cancha.hasta; hora++) {
            if (!horasOcupadas.includes(hora)) {
                horasDisponibles.push(hora);
            }
        }
        res.json({
            cancha: cancha.cancha,
            fecha,
            horasDisponibles
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener disponibilidad' });
    }
}


const obtenerDisponibilidadTodas = async (req, res) => {
    const { fecha } = req.query;

    try {
        const fechaInicio = new Date(fecha);
        const fechaFin = new Date(fecha);
        fechaFin.setDate(fechaFin.getDate() + 1);

        const [canchas, reservasDelDia] = await Promise.all([
            Cancha.find({ estado: true }),
            Reserva.find({
                estado: true,
                fecha: {
                    $gte: fechaInicio,
                    $lt: fechaFin
                }
            })
        ]);

        const resultado = canchas.map(cancha => {
            const reservasDeEstaCancha = reservasDelDia.filter(r =>
                r.cancha.toString() === cancha.id
            );

            const horasOcupadas = reservasDeEstaCancha.map(reserva => reserva.hora);
            const horasDisponibles = [];

            const rangoFin = cancha.hasta < cancha.desde ? cancha.hasta + 24 : cancha.hasta;

            for (let i = cancha.desde; i <= rangoFin; i++) {
                const horaReal = i >= 24 ? i - 24 : i;

                if (!horasOcupadas.includes(horaReal)) {
                    horasDisponibles.push(horaReal);
                }
            }

            return {
                id: cancha.id,
                nombre: cancha.cancha,
                horasDisponibles
            };
        });

        res.json({
            fecha,
            canchas: resultado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener disponibilidades' });
    }
}

module.exports = {
    canchasTodasGet,
    canchaGet,
    canchaPost,
    canchaPut,
    canchaDelete,
    obtenerHorasDisponibles,
    obtenerDisponibilidadTodas
}
