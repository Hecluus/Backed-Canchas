const { response, request } = require("express")

const Comentario = require('../models/comentario')

const comentarioGet = async (req = request, res = response) => {
    try {
        const { id } = req.params

        const comentario = await Comentario.findById(id).populate('usuario', 'nombre');

        const comentarioContenido = comentario.contenido

        res.json({
            mensaje: "Comentario obtenido",
            comentarioContenido
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensaje: "Error al obtener el comentario"
        })
    }
}

const comentariosTodosGet = async (req = request, res = response) => {
    try {
        const { desde = 0, limite = 3 } = req.query
        const query = { estado: true };

        const comentariosTotales = await Promise.all([
            Comentario.countDocuments(query),
            Comentario.find(query).skip(desde).limit(limite).populate('usuario', 'nombre')
        ]);

        res.json({
            mensaje: "Comentarios obtenidos",
            comentariosTotales
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensaje: "Error al obtener los comentarios"
        })
    }
};

const comentarioPost = async (req = request, res = response) => {
    try {
        const datos = req.body
        const { contenido, usuario } = datos

        const comentarioCreado = new Comentario({ contenido, usuario });

        await comentarioCreado.save();

        res.json({
            mensaje: "comentario creado",
            comentarioCreado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensaje: "Error al crear el comentario"
        })
    }
}

const comentarioPut = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const { contenido } = req.body;

        const comentarioActualizado = await Comentario.findByIdAndUpdate(id, { contenido }, { new: true });

        res.json({
            mensaje: "comentario actualizado",
            comentarioActualizado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensaje: "Error al actualizar el comentario"
        })
    }
}

const comentarioDelete = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const comentarioBorrado = Comentario.findByIdAndDelete(id, { estado: true }, { new: true });

        res.json({
            mensaje: "comentario borrado",
            comentarioBorrado
        })
    } catch (error) {
        console.log(error)
        throw new Error("Error al intentar borrar el comentario")
    }
}

module.exports = {
    comentarioGet,
    comentariosTodosGet,
    comentarioPost,
    comentarioPut,
    comentarioDelete
}