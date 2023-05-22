const express = require("express");

const {
  verifyToken,
  apiLimiter,
  corsWhenDomainMatches,
} = require("../middlewares");
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostsByHashtag,
  getPosts,
  deleteMyPosts,
  updateMyPosts,
} = require("../controllers/v2");

const router = express.Router();

router.use(corsWhenDomainMatches);

// POST /v2/token
router.post("/token", apiLimiter, createToken);

// POST /v2/test
router.get("/test", apiLimiter, verifyToken, tokenTest);

// GET /v2/posts/my
router.get("/posts", apiLimiter, getPosts);

// GET /v2/posts/my
router.get("/posts/my", apiLimiter, verifyToken, getMyPosts);

// GET /v2/posts/hashtag/:title
router.get("/posts/hashtag/:title", apiLimiter, verifyToken, getPostsByHashtag);

router.get("/posts/delete/:uuid", apiLimiter, verifyToken, deleteMyPosts);

router.get(
  "/posts/update/:uuid/:content",
  apiLimiter,
  verifyToken,
  updateMyPosts
);

module.exports = router;
