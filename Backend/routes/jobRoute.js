import express from "express";
import { createJob, getAllJobs, getJobById, applyForJob, deleteJob } from "../controllers/jobController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// HR routes
router.post("/create", authMiddleware, createJob); // Create job (Only HR)
router.delete("/:jobId", authMiddleware, deleteJob); // Delete job (Only HR)

// Common routes
router.get("/", getAllJobs); // Get all jobs
router.get("/:jobId", getJobById); // Get a specific job
router.post("/apply/:jobId", authMiddleware, applyForJob); // Apply for a job (Only students)

export default router;
