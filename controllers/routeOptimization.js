import { GoogleAuth } from "google-auth-library";
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
  try {
    const { body } = req;

    const accessToken = await getAccessToken();

    // to-do
    // 1 . get all valid shipments from the database --> only shipments those are in time window of global time window
    // 2 . get all vehicles from the database whose current status is inTransit is false
    // 3 . use pipeline aggregation to get all shipments and vehicles in one query
    // 4 . make a requestBody from the shipmet and vehicle and set global parameters then call api

    const requestBody = null;

    const response = await axios.post(API_URL, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    // 5 . in response add all those shipments which were left in the previous step due to the global time window and mark there reasons
    const updatedResponse = null;
    // 6 . then all set chilll....

    res.status(200).send(updatedResponse);
    // After basic implementation
    // 7 . user might regenate the routes if he wants to do so then we can use previous response to regenerate the routes
    
  } catch (error) {
    console.error(
      "Error optimizing routes:",
      error.response?.data || error.message
    );
    res.status(500).send("Internal server error");
  }
};
