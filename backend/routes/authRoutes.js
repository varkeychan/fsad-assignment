import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { getUsers } from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/users", getUsers); 

export default router;
