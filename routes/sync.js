const express = require("express");

const { syncProjects } = require("../controllers/sync");

const router = express.Router();

router.post("/project", syncProjects);

// // POST /v1/test
// router.get("/test", verifyToken, tokenTest);

// // GET /v1/posts/my
// router.get("/posts/my", verifyToken, getMyPosts);

// // GET /v1/posts/hashtag/:title
// router.get("/posts/hashtag/:title", verifyToken, getPostsByHashtag);

module.exports = router;
