const { Router } = require("express");
const { crearPreferencia, redirigir } = require('../controllers/mercadoPago');

const router = Router();

router.post("/", crearPreferencia);
router.get("/redirect", redirigir);

module.exports = router;