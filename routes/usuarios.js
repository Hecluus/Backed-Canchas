const { Router } = require('express');
const { usuariosTodosGet, usuarioGetID, usuarioPost, usuarioPut, usuarioDelete } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { usuarioExiste } = require('../helpers/dbValidators');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');
const { esAdminRole } = require('../middlewares/validarRoles');
const router = Router();

router.get('/', [
    validarJWT,
    esAdminRole
], usuariosTodosGet);

router.get('/:id', [
    validarJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(usuarioExiste),
    validarCampos
], usuarioGetID);

router.post('/', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('email', 'El email es obligatorio').notEmpty(),
    check('email', 'El email es invalido').isEmail(),
    check('password', 'El password es obligatorio').notEmpty(),
    check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
    validarCampos
], usuarioPost);

router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(usuarioExiste),
    validarCampos
], usuarioPut);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(usuarioExiste),
    validarCampos
], usuarioDelete);

module.exports = router;
