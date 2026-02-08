const { Router } = require("express");
const {
    pedidosGet,
    pedidoGet,
    pedidoPost,
    pedidoPut,
    pedidoDelete,
    misPedidosGet
} = require("../controllers/pedidos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole } = require("../middlewares/validar-roles");

const router = Router();

router.post("/", [validarJWT], pedidoPost);
router.get("/misPedidos", [validarJWT], misPedidosGet);

router.get("/", [validarJWT, esAdminRole], pedidosGet);
router.get("/:id", [validarJWT, esAdminRole], pedidoGet);
router.put("/:id", [validarJWT, esAdminRole], pedidoPut);
router.delete("/:id", [validarJWT, esAdminRole], pedidoDelete);

module.exports = router;