import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  latLng: {
    latitude: Number,
    longitude: Number,
  },
});

const TimeWindowSchema = new mongoose.Schema({
  startTime: {
    seconds: String,
  },
  endTime: {
    seconds: String,
  },
});

const VisitReqSchema = new mongoose.Schema({
  arrivalWaypoint: {
    location: LocationSchema,
  },
  timeWindows: [TimeWindowSchema],
  duration: {
    seconds: String,
  },
  cost: Number,
});

const LoadDemandsSchema = new mongoose.Schema({
  weight: {
    amount: String,
  },
});

const StatusSchema = new mongoose.Schema({
  isRouteOptimized: Boolean,
  vehicleUsed: mongoose.Schema.Types.ObjectId,
});

const ShipmentSchema = new mongoose.Schema({
  label: String,
  pickups: [VisitReqSchema],
  deliveries: [VisitReqSchema],
  loadDemands: LoadDemandsSchema,
  pickupToDeliveryTimeLimit: String,
  penaltyCost: Number,
  status: StatusSchema,
},{
  timestamps: true,
});


const Shipment = mongoose.model("Shipments", ShipmentSchema);
export default Shipment;