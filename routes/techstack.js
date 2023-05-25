const express = require("express");

const { syncTechstacks } = require("../controllers/techstack");

const router = express.Router();

router.post("/sync", syncTechstacks);

module.exports = router;
