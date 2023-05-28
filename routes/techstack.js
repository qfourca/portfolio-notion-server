const express = require("express");

const { syncTechstacks, listTechstacks } = require("../controllers/techstack");

const router = express.Router();

router.post("/sync", syncTechstacks);
router.get("/list", listTechstacks);

module.exports = router;
