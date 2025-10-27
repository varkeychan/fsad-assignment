import express from "express";
import {
  createRequest,
  getRequests,
  updateRequestStatus,
} from "../controllers/requestController.js";

const router = express.Router();

router.post("/", createRequest);
router.get("/", getRequests);
router.put("/:id", updateRequestStatus);

export default router;
