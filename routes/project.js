const express = require("express");

const { syncProjects } = require("../controllers/project");

const router = express.Router();

router.post("/sync", syncProjects);
// router.get("/list");

module.exports = router;
