const { Router } = require('express');
const { usuariosTodosGet, usuarioGetID, usuarioPost, usuarioPut, usuarioDelete } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { usuarioExiste } = require('../helpers/dbValidators');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');
const { esAdminRole } = require('../middlewares/validarRoles');

const router = Router();

// Obtener todos los usuarios (solo admins autenticados)
router.get('/', [
    validarJWT,
    esAdminRole
], usuariosTodosGet);

//  Obtener usuario por ID (solo admins autenticados)
router.get('/:id', [
    validarJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(usuarioExiste),
    validarCampos
], usuarioGetID);

// Registro abierto: cualquier persona puede crear usuario normal
router.post('/', [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('correo', 'El correo es obligatorio').notEmpty(),
    check('correo', 'El correo es invalido').isEmail(),
    check('password', 'El password es obligatorio').notEmpty(),
    check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
    validarCampos
], usuarioPost);

//  Crear admin: solo admins autenticados
router.post('/admin', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('correo', 'El correo es obligatorio').notEmpty(),
    check('correo', 'El correo es invalido').isEmail(),
    check('password', 'El password es obligatorio').notEmpty(),
    check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
    validarCampos
], usuarioPost);

//  Actualizar usuario (solo admins autenticados)
router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(usuarioExiste),
    validarCampos
], usuarioPut);

//  Eliminar usuario (solo admins autenticados)
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(usuarioExiste),
    validarCampos
], usuarioDelete);

module.exports = router;
