const Pedido = require("../models/pedido");

const pedidosGet = async (req, res) => {
    try {
        const { limite = 50, desde = 0 } = req.query;

        const [pedidos, total] = await Promise.all([
            Pedido.find()
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('usuario', 'nombre email')
                .populate('productos.comida', 'nombre precio')
                .sort({ fecha: -1 }),
            Pedido.countDocuments()
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
            .populate('productos.comida', 'nombre precio descripcion');

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
        const { productos, total } = req.body;
        const usuarioId = req.usuario._id;

        if (!productos || productos.length === 0) {
            return res.status(400).json({
                msg: "El pedido debe tener al menos un producto"
            });
        }

        const pedido = new Pedido({
            usuario: usuarioId,
            productos,
            total
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
        const { productos, total } = req.body;

        const pedido = await Pedido.findByIdAndUpdate(
            id,
            { productos, total },
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

const pedidoDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await Pedido.findByIdAndDelete(id);

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

const misPedidosGet = async (req, res) => {
    try {
        const usuarioId = req.usuario._id;

        const pedidos = await Pedido.find({ usuario: usuarioId })
            .populate('productos.comida', 'nombre precio')
            .sort({ fecha: -1 });

        res.json({ pedidos });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al obtener tus pedidos"
        });
    }
};

module.exports = {
    pedidosGet,
    pedidoGet,
    pedidoPost,
    pedidoPut,
    pedidoDelete,
    misPedidosGet
};