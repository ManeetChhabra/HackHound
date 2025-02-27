import express from "express";
import { fetchVideos } from "../controllers/videoController.js";

const router = express.Router();

router.get("/", fetchVideos);

export default router;
