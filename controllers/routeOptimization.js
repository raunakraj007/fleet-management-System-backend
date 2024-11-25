import { GoogleAuth } from "google-auth-library";
import Shipment from "../models/shipment.js";
import Vehicle from "../models/vehicle.js";
import axios from "axios";

const API_URL = `https://routeoptimization.googleapis.com/v1/projects/${process.env.PROJECT_ID}:optimizeTours`;

const SERVICE_ACCOUNT_KEY_FILE = process.env.SERVICE_ACCOUNT_KEY_FILE;

// Token cache
let cachedToken = null;
let tokenExpiryTime = null;

const getAccessToken = async () => {
  const currentTime = Date.now();

  //check token is still valid
  if (cachedToken && tokenExpiryTime && currentTime < tokenExpiryTime) {
    console.log("Using cached token");
    return cachedToken;
  }

  console.log("Generating a new token");
  const auth = new GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_FILE,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  console.log("Generating a new token");

  const client = await auth.getClient();
  console.log("Generating a client");
  const tokenResponse = await client.getAccessToken();
  console.log("Generating a token response", tokenResponse);

  // Update cache
  cachedToken = tokenResponse.token;
  tokenExpiryTime = currentTime + 3600 * 1000; // Token is valid for 1 hour

  return cachedToken;
};

export const handleRouteOptimization = async (req, res) => {
  const { body } = req;

  if(body?.globalStartTime === undefined || body?.globalEndTime === undefined) {
    res.status(400).send("globalStartTime and globalEndTime are required");
    return;
  }

  try {
    const accessToken = await getAccessToken();

    const { payload, invalidShipments } = await makePayloadAndInvalidShipments(
      body
    );



    const response = await axios.post(API_URL, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    response.data.missedShipmetsDueToGlobalTimeWindow = invalidShipments;

    res.status(200).send(response.data);

    // to-do After basic implementation
    // user might regenate the routes if he wants to do so then we can use previous response to regenerate the routes for better results
  } catch (error) {
    if (error.message) {
      console.error("Error :", error.message);
    }
    console.error(
      "Error optimizing routes:",
      error.response?.data || error.message
    );
    res.status(500).send("Internal server error");
  }
};



const getValidShipments = async (globalStartTime, globalEndTime) => {
  const shipments = await Shipment.find({
    "status.isRouteOptimized": false,
  }).select(
    "-_id -status -pickups._id -pickups.arrivalWaypoint.location._id -pickups.timeWindows._id -deliveries._id -deliveries.arrivalWaypoint.location._id -deliveries.timeWindows._id -loadDemands._id -__v -createdAt -updatedAt"
  );

  const validShipments = [];
  const invalidShipments = [];

  shipments.forEach((shipment) => {
    const pickupStart = Number(
      shipment?.pickups?.[0]?.timeWindows?.[0]?.startTime?.seconds ?? -1
    );
    const pickupEnd = Number(
      shipment?.pickups?.[0]?.timeWindows?.[0]?.endTime?.seconds ?? -1
    );
    const deliveryStart = Number(
      shipment?.deliveries?.[0]?.timeWindows?.[0]?.startTime?.seconds ?? -1
    );
    const deliveryEnd = Number(
      shipment?.deliveries?.[0]?.timeWindows?.[0]?.endTime?.seconds ?? -1
    );

    if (
      (pickupStart === -1 || pickupEnd === -1) &&
      (deliveryStart === -1 || deliveryEnd === -1)
    ) {
      //means there is no time window for this shipment
      validShipments.push(shipment);
      return;
    }

    if (
      pickupStart != -1 &&
      pickupEnd != -1 &&
      deliveryStart == -1 &&
      deliveryEnd == -1
    ) {
      //means there is only pickup time window
      if (pickupStart >= globalStartTime && pickupEnd <= globalEndTime) {
        validShipments.push(shipment);
      } else {
        invalidShipments.push(shipment);
      }
      return;
    }

    if (
      pickupStart == -1 &&
      pickupEnd == -1 &&
      deliveryStart != -1 &&
      deliveryEnd != -1
    ) {
      //means there is only delivery time window
      if (deliveryStart >= globalStartTime && deliveryEnd <= globalEndTime) {
        validShipments.push(shipment);
      } else {
        invalidShipments.push(shipment);
      }
      return;
    }

    if (
      pickupStart != -1 &&
      pickupEnd != -1 &&
      deliveryStart != -1 &&
      deliveryEnd != -1
    ) {
      //means there is both pickup and delivery time window
      if (
        pickupStart >= globalStartTime &&
        pickupEnd <= globalEndTime &&
        deliveryStart >= globalStartTime &&
        deliveryEnd <= globalEndTime
      ) {
        validShipments.push(shipment);
      } else {
        invalidShipments.push(shipment);
      }
      return;
    }
  });

  return { validShipments, invalidShipments };
};

const getAvailableVehicles = async () => {
  console.log("Getting vehicles");
  const vehicles = await Vehicle.find({
    "status.inTransit": false,
  }).select(
    "-_id -routeModifiers._id -startWaypoint.location._id -endWaypoint.location._id -startTimeWindows._id -endTimeWindows._id -loadLimits._id -__v -createdAt -updatedAt -status"
  );

  return vehicles;
};

const makePayloadAndInvalidShipments = async (body) => {
  const { validShipments, invalidShipments } = await getValidShipments(
    Number(body?.globalStartTime),
    Number(body?.globalEndTime)
  );

  const avlVehicles = await getAvailableVehicles();

  const model = {
    shipments: validShipments,
    vehicles: avlVehicles,
    globalStartTime: {
      seconds: body.globalStartTime,
    },
    globalEndTime: {
      seconds: body.globalEndTime,
    },
  };

  if (body?.maxActiveVehicles) {
    model.maxActiveVehicles = body.maxActiveVehicles;
  }

  const payload = {
    timeout: {
      seconds: body?.maxTime ?? 10,
    },

    model: model,
    searchMode: body?.searchMode ?? 1,
    considerRoadTraffic: body?.considerRoadTraffic ?? false,
    populatePolylines: true,
    label: body?.label ?? "no label",
  };

  return { payload, invalidShipments };
};
