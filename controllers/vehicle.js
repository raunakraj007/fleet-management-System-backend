import Vehicle from "../models/vehicle.js";

export const handleAddVehicle = async (req, res) => {
  console.log("request to add vehicle");
  const vehicle = req.body;
  try {
    vehicle.status = {
      inTransit: false,
    };

    const newVehicle = new Vehicle(vehicle);
    await newVehicle.save();

    res.status(201).json(newVehicle._id);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error adding vehicle");
  }
};

export const handleGetVehicles = async (req, res) => {
  console.log("get vehicles request");
  try {
    const vehicles = await Vehicle.find().select("-routeModifiers._id -startWaypoint.location._id -endWaypoint.location._id -startTimeWindows._id -endTimeWindows._id -loadLimits._id -status._id -__v");
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const handleEditVehicle = async (req, res) => {
  console.log("request to edit vehicle");
  const { _id, ...vehicle } = req.body;
  console.log(vehicle);

  try {
    await Vehicle.findByIdAndUpdate(_id, { $set: vehicle });
    res.status(200).send("Vehicle updated successfully");
  } catch (error) {
    res.status(400).send("Error updating vehicle");
  }
};

export const handleDeleteVehicle = async (req, res) => {
  console.log("request to delete vehicle");
  const _id = req.params._id;

  try {
    await Vehicle.findByIdAndDelete(_id);
    res.status(200).send("Vehicle deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting vehicle");
  }
};
