import express from "express";
import { body } from "express-validator";
import * as feedController from "../controller/feed.js";

import isAuth from "../middleware/is-auth.js";

const router = express.Router();

// GET /feed/posts
router.get("/posts", isAuth, feedController.getPosts);

router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

router.get("/post/:postId", feedController.getPost);

router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.delete("/post/:postId", feedController.deletePost);

export default router;
