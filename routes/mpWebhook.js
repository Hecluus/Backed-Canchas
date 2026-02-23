const { Router } = require("express");
const { recibirWebhook } = require("../controllers/mpWebhook")

const router = Router();

router.post("/webhook", recibirWebhook);

module.exports = router;