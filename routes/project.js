const express = require("express");

const { syncProjects } = require("../controllers/project");

const router = express.Router();

router.post("/sync", syncProjects);

module.exports = router;
