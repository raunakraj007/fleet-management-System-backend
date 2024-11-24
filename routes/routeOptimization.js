import express from "express";
import { handleRouteOptimization } from "../controllers/routeOptimization.js";

const router = express.Router();

router.get("/", handleRouteOptimization);

export default router;
