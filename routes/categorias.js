const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categorias");

// Middlewares
const { validarJWT } = require("../middlewares/validarJWT");
const { esAdminRole } = require("../middlewares/validarRoles");

// Crear categoría
router.post("/", [validarJWT, esAdminRole], categoriaController.crearCategoria);

// Listar categorías 
router.get("/", categoriaController.obtenerCategorias);

// Obtener una categoría 
router.get("/:id", categoriaController.obtenerCategoria);

// Actualizar categoría (
router.put("/:id", [validarJWT, esAdminRole], categoriaController.actualizarCategoria);

// Eliminar categoría 
router.delete("/:id", [validarJWT, esAdminRole], categoriaController.eliminarCategoria);

module.exports = router;
