import express from "express";
import * as feedController from "../controller/feed.js";

const router = express.Router();

// GET /feed/posts
router.get("/posts", feedController.getPost);

export default router;