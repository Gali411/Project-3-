import express from "express";
import { fetchRecommendations } from "../controllers/recommendationsController.js";

const router = express.Router();

router.get("/", fetchRecommendations);

export default router;
