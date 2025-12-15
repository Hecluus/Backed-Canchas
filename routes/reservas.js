const { Router } = require("express");

const { reservasTodasGet, reservaGet, reservaPost, reservaPut, reservaDelete } = require("../controllers/reservas");

const router = Router();

router.get("/", reservasTodasGet);

router.get("/:id", reservaGet);

router.post("/", reservaPost);

router.put("/:id", reservaPut);

router.delete("/:id", reservaDelete);

module.exports = router;
