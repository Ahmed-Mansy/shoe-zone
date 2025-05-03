import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditAddress = () => {
  const [formData, setFormData] = useState({
    country: "",
    city: "",
    street: "",
    postcode: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchAddress = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/addresses/detail/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const address = response.data;
        if (address) {
          setFormData({
            country: address.country || "",
            city: address.city || "",
            street: address.address_line_1 || "",
            postcode: address.postcode || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch address:", error);
        // لو مفيش عنوان مسبق مش مشكلة نخلي الفورم فاضي
      }
    };

    fetchAddress();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        toast.error("Please login first.");
        // navigate("/login");
        return;
      }

      const response = await axios.put(
        "http://127.0.0.1:8000/api/addresses/update/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      toast.success("Address updated successfully.");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address.");
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
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Country</option>
              <option value="Egypt">Egypt</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">City</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select City</option>
              <option value="Alexandria">Alexandria</option>
              <option value="Aswan">Aswan</option>
              <option value="Asyut">Asyut</option>
              <option value="Beni Suef">Beni Suef</option>
              <option value="Cairo">Cairo</option>
              <option value="Damietta">Damietta</option>
              <option value="Damanhur">Damanhur</option>
              <option value="Faiyum">Faiyum</option>
              <option value="Giza">Giza</option>
              <option value="Hurghada">Hurghada</option>
              <option value="Ismailia">Ismailia</option>
              <option value="Luxor">Luxor</option>
              <option value="Mansoura">Mansoura</option>
              <option value="Minya">Minya</option>
              <option value="Port Said">Port Said</option>
              <option value="Qena">Qena</option>
              <option value="Sharm El Sheikh">Sharm El Sheikh</option>
              <option value="Shubra El Kheima">Shubra El Kheima</option>
              <option value="Sohag">Sohag</option>
              <option value="Suez">Suez</option>
              <option value="Tanta">Tanta</option>
              <option value="Zagazig">Zagazig</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Street / House Address
            </label>
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
