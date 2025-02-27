import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    jobType: { type: String, enum: ["Full-time", "Part-time", "Internship"], required: true },
    description: { type: String, required: true },
    requirements: { type: [String], required: true },
    salary: { type: String, required: false },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // HR posting the job
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users applying for job
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
