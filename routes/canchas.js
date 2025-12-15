const { Router } = require("express");

const { canchasTodasGet, canchaGet, canchaPost, canchaPut, canchaDelete } = require("../controllers/canchas");

const router = Router();

router.get("/", canchasTodasGet);

router.get("/:id", canchaGet);

router.post("/", canchaPost);

router.put("/:id", canchaPut);

router.delete("/:id", canchaDelete);

module.exports = router;