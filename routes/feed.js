import express from "express";
import { body } from "express-validator/check/index.js";
import * as feedController from "../controller/feed.js";

const router = express.Router();

// GET /feed/posts
router.get("/posts", feedController.getPost);

router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

export default router;
