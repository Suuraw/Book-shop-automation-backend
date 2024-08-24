import express from "express";
import homePage from "../controllers/getHomePage.js";
const router=express.Router();
router.get("/homePage",homePage);
export default router;