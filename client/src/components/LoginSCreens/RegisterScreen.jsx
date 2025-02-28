import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../axios.config.js";

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    skills: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (e) => {
    setSkillInput(e.target.value);
  };

  const handleSkillAdd = () => {
    const trimmedSkill = skillInput.trim();
    if (
      trimmedSkill !== "" &&
      !formData.skills.some((skillObj) => skillObj.name === trimmedSkill)
    ) {
      setFormData({
        ...formData,
        skills: [...formData.skills, { name: trimmedSkill, level: skillLevel }],
      });
      setSkillInput("");
      setSkillLevel("beginner");
    }
  };

  const handleSkillRemove = (indexToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, index) => index !== indexToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/user/register", formData);
      setSuccess("Registration attempted."); // Optionally handle success
      setError("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
      setSuccess("");
    } finally {
      // Redirect to /scraps regardless of success or error
      navigate("/scraps");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        <div className="w-full md:w-1/2">
          <img
            src="./src/assets/Images/ai-generated-8810198_1280.webp"
            alt="Engineers working"
            className="object-cover w-full h-48 md:h-full"
          />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8">
          <div className="w-full">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-4 md:mb-6">
              Welcome to Skills Sensei..!
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2 text-sm">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your Name"
                  className="w-full px-4 py-2 border border-orange-400 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2 text-sm">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your Email Address"
                  className="w-full px-4 py-2 border border-orange-400 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 mb-2 text-sm">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your Password"
                  className="w-full px-4 py-2 border border-orange-400 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="role" className="block text-gray-700 mb-2 text-sm">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-orange-400 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  required
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>

              {/* Skills Input Section */}
              <div className="mb-4">
                <label htmlFor="skills" className="block text-gray-700 mb-2 text-sm">
                  Skills
                </label>
                <div className="flex">
                  <input
                    id="skills"
                    type="text"
                    value={skillInput}
                    onChange={handleSkillChange}
                    placeholder="Enter a skill"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSkillAdd();
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-orange-400 rounded-l-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                  <select
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className="px-4 py-2 border-t border-b border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleSkillAdd}
                    className="bg-orange-500 text-white px-4 py-2 rounded-r-full hover:bg-orange-600 transition duration-300 text-sm"
                  >
                    Add
                  </button>
                </div>
                {/* Display added skills */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {skill.name} ({skill.level})
                      <button
                        type="button"
                        className="ml-2 text-orange-500 hover:text-orange-700"
                        onClick={() => handleSkillRemove(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded-full hover:bg-orange-600 transition duration-300 text-sm"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
