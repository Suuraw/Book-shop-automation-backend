// routes/authRoutes.js
import express from "express";
import { signup, login } from "../controllers/authCustomer.js";
import { clerkSignup, clerkLogin } from "../controllers/authClerk.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/clerk/signup", clerkSignup);
router.post("/clerk/login", clerkLogin);

export default router;
