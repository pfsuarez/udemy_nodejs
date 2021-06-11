import express from "express";
import { body } from "express-validator";
import * as feedController from "../controller/feed.js";

const router = express.Router();

// GET /feed/posts
router.get("/posts", feedController.getPosts);

router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

router.get("/post/:postId", feedController.getPost);

export default router;
