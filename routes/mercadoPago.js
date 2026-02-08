const { Router } = require("express");
const { crearPreferencia } = require('../controllers/mercadoPago');

const router = Router();

router.post("/", crearPreferencia);

module.exports = router;