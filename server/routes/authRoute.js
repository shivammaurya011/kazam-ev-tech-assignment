import express from "express";
import { register, login, logout, verify } from "../controllers/authController.js";

const router = express.Router();

// Routes for auth
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", verify);

export default router;
