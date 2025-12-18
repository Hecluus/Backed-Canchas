const express = require('express');
const router = express.Router();
const comidaController = require('../controllers/comidas');

router.post('/', comidaController.crearComida);
router.get('/', comidaController.obtenerComidas);
router.get('/:id', comidaController.obtenerComida);
router.put('/:id', comidaController.actualizarComida);
router.delete('/:id', comidaController.eliminarComida);

module.exports = router;
