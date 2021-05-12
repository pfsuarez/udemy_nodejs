import express from "express";

const router = express.Router();

router.get("/", (req, res, next) => {
  return res.send("<h1>Hello from express.js</h1>")
});

export default router;