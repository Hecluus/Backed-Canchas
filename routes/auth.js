const { Router } = require('express');
const { login, recuperarContrasenia, cambiarContrasenia } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();

router.post('/login', [
    check('correo', 'El correo no es válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/recuperarContrasenia', [
    check('correo', 'El correo no es válido').isEmail(),
    validarCampos
], recuperarContrasenia);

router.put('/cambiarContrasenia/:id/:token', [
    check('id', 'El id no es válido').isMongoId(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    check('password', 'La contraseña debe tener al menos 8 caracteres').isLength({ min: 8 }),
    validarCampos
], cambiarContrasenia);

module.exports = router;