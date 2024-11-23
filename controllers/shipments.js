import Shipment from "../models/shipment.js";

export const handleAddShipments = async (req, res) => {
  const shipments = req.body;
  shipments.forEach(async (shipment) => {
    shipment.status = {
      isRouteOptimized: false,
      vehicleUsed: null,
    };
    const newShipment = new Shipment(shipment);
    try {
      await newShipment.save();
    } catch (error) {
      res.status(400).send("Error adding shipment");
    }
  });
  res.status(200).send("Shipments added successfully");
};

export const handleEditShipment = async (req, res) => {
  const { _id, ...shipment } = req.body;
  try {
    await Shipment.findByIdAndUpdate(_id, { $set: shipment });
    res.status(200).send("Shipment updated successfully");
  } catch (error) {
    res.status(400).send("Error updating shipment");
  }
};

export const handleDeleteShipment = async (req, res) => {
  const { _id } = req.body;
  try {
    await Shipment.findByIdAndDelete(_id);
    res.status(200).send("Shipment deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting shipment");
  }
};


const getIncompleteShipments = async (page, size) => {

  //for skipping the shipments
  const skip = (page - 1) * size;

  
  const shipments = await Shipment.find({ "status.isRouteOptimized": false })
    .sort({ createdAt: 1 }) // 1 for ascending order 
    .skip(skip) 
    .limit(size);

  return shipments;
};


const getIncompleteShipmentsCount = async () => {
  const count = await Shipment.countDocuments({
    "status.isRouteOptimized": false,
  });
  return count;
};

export const handleGetIncompleteShipments = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 50; 

  try {
    const shipments = await getIncompleteShipments(page, size);

    const totalCount = await getIncompleteShipmentsCount();

    const totalPages = Math.ceil(totalCount / size);

    res.json({
      data: shipments,
      total_count: totalCount,
      total_pages: totalPages,
      current_page: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching incomplete shipments");
  }
};

export const handleGetShipmentsByLabel = async (req, res) => {
  const { label } = req.query; 
  if (!label) {
    return res
      .status(400)
      .json({ message: "Label query parameter is required" });
  }

  try {

    //i for case-insensitive and this label can be anywhere in the string
    const shipments = await Shipment.find({
      label: { $regex: label, $options: "i" }, 
    });

    if (shipments.length === 0) {
      return res
        .status(404)
        .json({ message: "No shipments found with the given label" });
    }
    res.status(200).json(shipments);
  } catch (error) {
    console.error("Error fetching shipments:", error);
    res.status(500).json({ message: "Server error" });
  }
};


