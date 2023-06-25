const express = require("express");

const { syncProjects, listProjects } = require("../controllers/project");
const { linkTechstackNProject } = require("../controllers/link");

const router = express.Router();

router.post("/sync", syncProjects);
router.post("/linktechstack", linkTechstackNProject);
router.get("/list", listProjects);

module.exports = router;
