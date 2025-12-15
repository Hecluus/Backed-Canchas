const { request, response } = require("express");
const Cancha = require("../models/cancha");

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
    const { canchas, desde, hasta } = req.body;
    const cancha = new Cancha({ canchas, desde, hasta });

    if (cancha.canchas == 0) {
        return res.status(400).json({
            msg: "el numero de las chanchas deben ser mayores a 0"
        });
    }

    await cancha.save();
    res.json({
        cancha,
        msg: "canchaPost"
    });
}

const canchaPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { canchas, desde, hasta } = req.body;
    const cancha = await Cancha.findById(id);

    cancha.canchas = canchas;
    cancha.desde = desde;
    cancha.hasta = hasta;

    await cancha.save();

    res.json({
        cancha,
        msg: "cancha actualizada"
    });
}

const canchaDelete = async (req = request, res = response) => {
    const { id } = req.params;
    const cancha = await Cancha.findByIdAndDelete(id, { estado: false }, { new: true });
    res.json({
        cancha,
        msg: "cancha esta inactivada"
    });
}

module.exports = {
    canchasTodasGet,
    canchaGet,
    canchaPost,
    canchaPut,
    canchaDelete
}
