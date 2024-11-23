import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import routes
import usersRouter from "./routes/users.js";
import shipmentsRouter from "./routes/shipments.js";
import vehicleRouter from "./routes/vehicle.js";
import auth from "./middlewares/auth.js";

const app = express();
const port = process.env.PORT;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api/users", usersRouter);
app.use("/api/shipments", auth, shipmentsRouter);
app.use("/api/vehicles", auth, vehicleRouter);

app.get("/api/getData", auth, (req, res) => {
  res.send("Data fetched from  protected rout of the server");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    // Start the server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
  });
