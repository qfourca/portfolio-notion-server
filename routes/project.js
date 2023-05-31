const express = require("express");

const { syncProjects, listProjects } = require("../controllers/project");

const router = express.Router();

router.post("/sync", syncProjects);
router.get("/list", listProjects);

module.exports = router;
