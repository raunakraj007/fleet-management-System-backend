import express from "express";
import {
  handleAddShipments,
  handleEditShipment,
  handleDeleteShipment,
  handleGetIncompleteShipments,
  handleGetShipmentsByLabel,
  getAllIncompleteShipments,
  handleAddMultipleShipments,
} from "../controllers/shipments.js";

const router = express.Router();

router.post("/addShipmet", handleAddShipments);

router.post("/addMultiShipmet", handleAddMultipleShipments);

router.post("/editShipment", handleEditShipment);

router.post("/deleteShipment/:_id", handleDeleteShipment);

router.get("/getIncompleteShipments", getAllIncompleteShipments);

router.get("/getShipmentsByLabel", handleGetShipmentsByLabel);

export default router;
