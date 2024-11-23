import express from "express";
import {
  handleAddVehicle,
  handleGetVehicles,
  handleEditVehicle,
  handleDeleteVehicle,
} from "../controllers/vehicle.js";

const router = express.Router();

router.post("/addVehicle", handleAddVehicle);

router.get("/getVehicles", handleGetVehicles);

router.post("/editVehicle", handleEditVehicle);

router.post("/deleteVehicle/:_id", handleDeleteVehicle);

export default router;

