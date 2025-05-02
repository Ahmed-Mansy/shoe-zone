import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditAddress = () => {
  const [formData, setFormData] = useState({
    country: "",
    city: "",
    street: "",
    postcode: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      const response = await axios.put(
        "http://127.0.0.1:8000/addresses/update/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      navigate("/profile");
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to update address.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      style={{ width: "800px" }}
      className="rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200 p-6"
    >
      <h2 className="text-center text-2xl font-bold mb-6">Update Address</h2>
  
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto space-y-4"
      >
        <div>
          <label className="block text-gray-700 mb-1">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
  
        <div>
          <label className="block text-gray-700 mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
  
        <div>
          <label className="block text-gray-700 mb-1">Street / House Address</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
  
        <div>
          <label className="block text-gray-700 mb-1">Postcode</label>
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
  
        <div className="flex gap-2">
          <button
            type="submit"
            className="w-1/2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="w-1/2 border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50 transition"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
  
  );
};

export default EditAddress;
