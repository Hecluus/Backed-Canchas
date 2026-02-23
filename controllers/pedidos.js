const Pedido = require("../models/pedido");

const pedidosGet = async (req, res) => {
    try {
        const { limite = 50, desde = 0 } = req.query;

        const [pedidos, total] = await Promise.all([
            Pedido.find({ estado: true })
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('usuario', 'nombre email')
                .populate('items.comidaId', 'nombre')
                .sort({ fecha: -1 }),
            Pedido.countDocuments({ estado: true })
        ]);

        res.json({
            total,
            pedidos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al obtener pedidos"
        });
    }
};

const pedidoGet = async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await Pedido.findById(id)
            .populate('usuario', 'nombre email')
            .populate('items.comidaId', 'nombre descripcion');

        if (!pedido) {
            return res.status(404).json({
                msg: "Pedido no encontrado"
            });
        }

        res.json(pedido);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al obtener el pedido"
        });
    }
};

const pedidoPost = async (req, res) => {
    try {
        const { items, total } = req.body;
        const usuarioId = req.usuario._id;
        const nombreUsuario = req.usuario.nombre;

        if (!items || items.length === 0) {
            return res.status(400).json({
                msg: "El pedido debe tener al menos un item"
            });
        }

        if (!total || total <= 0) {
            return res.status(400).json({
                msg: "El total debe ser mayor a 0"
            });
        }

        const pedido = new Pedido({
            usuario: usuarioId,
            nombreUsuario,
            items,
            total,
            entregado: false
        });

        await pedido.save();

        res.status(201).json({
            msg: "Pedido creado exitosamente",
            pedido
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al crear el pedido"
        });
    }
};

const pedidoPut = async (req, res) => {
    try {
        const { id } = req.params;
        const { entregado } = req.body;

        const pedido = await Pedido.findByIdAndUpdate(
            id,
            { entregado },
            { new: true }
        );

        if (!pedido) {
            return res.status(404).json({
                msg: "Pedido no encontrado"
            });
        }

        res.json({
            msg: "Pedido actualizado",
            pedido
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al actualizar el pedido"
        });
    }
};

const misPedidosGet = async (req, res) => {
    try {
        const usuarioId = req.usuario._id;

        const pedidos = await Pedido.find({
            usuario: usuarioId,
            estado: true
        })
            .populate('items.comidaId', 'nombre')
            .sort({ fecha: -1 });

        res.json({
            pedidos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al obtener tus pedidos"
        });
    }
};

const pedidoDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await Pedido.findByIdAndUpdate(
            id,
            { estado: false },
            { new: true }
        );

        if (!pedido) {
            return res.status(404).json({
                msg: "Pedido no encontrado"
            });
        }

        res.json({
            msg: "Pedido eliminado correctamente",
            pedido
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al eliminar el pedido"
        });
    }
};

module.exports = {
    pedidosGet,
    pedidoGet,
    pedidoPost,
    pedidoPut,
    misPedidosGet,
    pedidoDelete
};
