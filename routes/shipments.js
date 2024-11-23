import express from "express";
import {
  handleAddShipments,
  handleEditShipment,
  handleDeleteShipment,
  handleGetIncompleteShipments,
  handleGetShipmentsByLabel,
} from "../controllers/shipments.js";
const router = express.Router();

router.post("/addShipmet", handleAddShipments);

router.post("/editShipment", handleEditShipment);

router.post("/deleteShipment/:_id", handleDeleteShipment);

router.get("/getIncompleteShipments", handleGetIncompleteShipments);

router.get("/getShipmentsByLabel", handleGetShipmentsByLabel);

export default router;
