const { Router } = require("express");
const { pedidosGet, pedidoGet, pedidoPost, pedidoPut, misPedidosGet, pedidoDelete } = require("../controllers/pedidos");
const { validarJWT } = require("../middlewares/validarJWT");
const { esAdminRole } = require("../middlewares/validarRoles");

const router = Router();

router.post("/", [
    validarJWT
], pedidoPost);

router.get("/misPedidos", [
    validarJWT
], misPedidosGet);

router.get("/", [
    validarJWT,
    esAdminRole
], pedidosGet);

router.get("/:id", [
    validarJWT,
    esAdminRole
], pedidoGet);

router.put("/:id", [
    validarJWT,
    esAdminRole
], pedidoPut);

router.delete("/:id", [
    validarJWT,
    esAdminRole
], pedidoDelete);

module.exports = router;
