const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require('../middlewares/validarCampos');
const { comentarioGet, comentariosTodosGet, comentarioPut, comentarioPost } = require("../controllers/comentarios");
const { comentarioExiste } = require("../helpers/dbValidators")

const router = Router();

router.get('/:id', [
    check('id', "el id no es válido").isMongoId(),
    validarCampos
], comentarioGet);

router.get('/', comentariosTodosGet);

router.post('/', [
    check('contenido', "El contenido es obligatorio").notEmpty(),
    validarCampos,
], comentarioPost);

router.put('/:id', [
    validarCampos
], comentarioPut);

router.delete('/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(comentarioExiste),
    validarCampos
])

module.exports = router;