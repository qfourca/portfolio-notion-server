const express = require("express");

const { page } = require("../controllers/notion");

const router = express.Router();

router.get("/page", page);
// router.get("/list", listProjects);

module.exports = router;
