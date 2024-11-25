import express from "express";
import { handleRouteOptimization } from "../controllers/routeOptimization.js";

const router = express.Router();

router.post("/", handleRouteOptimization);

export default router;
