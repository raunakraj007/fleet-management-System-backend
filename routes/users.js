import express from "express";
import {
  handleLogin,
  handleLogout,
  handleRegister,
} from "../controllers/users.js";

const router = express.Router();

router.post("/register", handleRegister);

router.post("/login", handleLogin);

router.post("/logout", handleLogout);

export default router;
