import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  latLng: {
    latitude: Number,
    longitude: Number,
  },
});

const RouteModifiersSchema = new mongoose.Schema({
  avoidTolls: Boolean,
  avoidHighways: Boolean,
});

const TimeWindowSchema = new mongoose.Schema({
  startTime: {
    seconds: String,
  },
  endTime: {
    seconds: String,
  },
});

const LoadLimitsSchema = new mongoose.Schema({
  weight: {
    amount: String,
  },
});

const statusSchema = new mongoose.Schema({
  inTransit: Boolean,
});

const VehicleSchema = new mongoose.Schema(
  {
    label: String,
    routeModifiers: RouteModifiersSchema,
    startWaypoint: {
      location: LocationSchema,
    },
    endWaypoint: {
      location: LocationSchema,
    },
    startTimeWindows: [TimeWindowSchema],
    endTimeWindows: [TimeWindowSchema],
    loadLimits: LoadLimitsSchema,
    costPerHour: Number,
    fixedCost: Number,
    travelDurationMultiple: Number,
    status: statusSchema,
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model("Vehicles", VehicleSchema);
export default Vehicle;
