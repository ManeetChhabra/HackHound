import React, { useState } from "react";

const JobPostingForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    description: "",
    requirements: "",
    salary: "",
    postedBy: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://your-backend-endpoint.com/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl w-full">
        {/* Form Section */}
        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-bold text-black mb-4">Job Posting Form</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {[
              { name: "title", placeholder: "Job Title" },
              { name: "company", placeholder: "Company Name" },
              { name: "location", placeholder: "Location" },
              { name: "jobType", placeholder: "Job Type" },
              { name: "requirements", placeholder: "Requirements (comma separated)" },
              { name: "salary", placeholder: "Salary" },
              { name: "postedBy", placeholder: "Posted By" },
            ].map((field) => (
              <input
                key={field.name}
                type="text"
                name={field.name}
                placeholder={field.placeholder}
                className="w-full border rounded-md p-3 text-gray-700"
                onChange={handleChange}
              />
            ))}
            
            <textarea
              name="description"
              placeholder="Job Description"
              className="w-full border rounded-md p-3 text-gray-700 h-24"
              onChange={handleChange}
            ></textarea>
            
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-md text-lg font-semibold hover:bg-gray-800"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Image Section */}
        <div className="w-1/2 relative bg-orange-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="./src/assets/Images/Illustration (1).png"
              alt="Job posting illustration"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute text-white text-center p-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingForm;