const { Router } = require('express');
const { usuariosTodosGet, usuarioGetID, usuarioPost, usuarioPut, usuarioDelete } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosTodosGet);

router.get('/:id', usuarioGetID);

router.post('/', usuarioPost);

router.put('/:id', usuarioPut);

router.delete('/:id', usuarioDelete);

module.exports = router;
