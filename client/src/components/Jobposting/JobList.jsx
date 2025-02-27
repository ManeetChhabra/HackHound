import React, { useEffect, useState } from "react";
import axios from "axios";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:3015/api/v1/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    
    fetchJobs();
  }, []);

  return (
    <div className="max-w-6xl mt-24  py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="p-6 border rounded-md shadow-lg bg-white">
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.description}</p>
            <p className="text-gray-800 font-medium">Company: {job.company}</p>
            <p className="text-gray-800">Location: {job.location}</p>
            <p className="text-gray-900 font-semibold">Salary: ${job.salary}</p>
            <button 
              onClick={() => applyForJob(job._id)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobList;
