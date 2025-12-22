const { Router } = require("express");

const { canchasTodasGet, canchaGet, canchaPost, canchaPut, canchaDelete, obtenerHorasDisponibles, obtenerDisponibilidadTodas } = require("../controllers/canchas");
const { validarCampos } = require("../middlewares/validarCampos");
const { esAdminRole } = require("../middlewares/validarRoles");
const { validarJWT } = require("../middlewares/validarJWT");
const { check } = require("express-validator");
const { canchaExiste } = require("../helpers/dbValidators");

const router = Router();

router.get("/", canchasTodasGet);

router.get("/disponibilidadTodas", [
    check('fecha', 'La fecha es obligatoria').notEmpty(),
    validarCampos
], obtenerDisponibilidadTodas);

router.get("/disponibilidad/:id", [
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(canchaExiste),
    check('fecha', 'La fecha es obligatoria').notEmpty(),
    validarCampos
], obtenerHorasDisponibles);

router.get("/:id", [
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(canchaExiste),
    validarCampos
], canchaGet);

router.post("/", [
    check('cancha', 'La cantidad de canchas es obligatoria').notEmpty(),
    check('desde', 'La hora es obligatoria').notEmpty(),
    check('hasta', 'La hora es obligatoria').notEmpty(),
    check('precio', 'El precio es obligatorio').notEmpty(),
    validarCampos
], canchaPost);

router.put("/:id", [
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(canchaExiste),
    validarCampos
], canchaPut);

router.delete("/:id", [
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(canchaExiste),
    validarCampos
], canchaDelete);

module.exports = router;