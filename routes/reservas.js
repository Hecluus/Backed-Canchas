const { Router } = require("express");

const { reservasTodasGet, reservaGet, reservaPost, reservaPut, reservaDelete, obtenerMisReservas } = require("../controllers/reservas");
const { check } = require("express-validator");
const { reservaExiste } = require("../helpers/dbValidators");
const { validarCampos } = require("../middlewares/validarCampos");
const { validarJWT } = require("../middlewares/validarJWT");
const { esAdminRole } = require("../middlewares/validarRoles");

const router = Router();

router.get("/misReservas", [
    validarJWT
], obtenerMisReservas);

router.get("/", [
    validarJWT,
    esAdminRole
], reservasTodasGet);

router.get("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(reservaExiste),
    validarCampos
], reservaGet);

router.post("/", [
    validarJWT,
    // check('canchas', 'La cantidad de canchas es obligatoria').notEmpty(),
    // check('desde', 'La hora es obligatoria').notEmpty(),
    // check('hasta', 'La hora es obligatoria').notEmpty(),
    validarCampos
], reservaPost);

router.put("/:id", [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(reservaExiste),
    validarCampos
], reservaPut);

router.delete("/:id", [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(reservaExiste),
    validarCampos
], reservaDelete);

module.exports = router;
