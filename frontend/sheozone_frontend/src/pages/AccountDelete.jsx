import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = "http://127.0.0.1:8000/api/";

function AccountDelete() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete your account?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.post(`${BASE_URL}users/delete-account/`, {
        email: email,
        password: password,
      });

      await Swal.fire(
        "Deleted!",
        "Your account has been deleted successfully.",
        "success"
      );

      navigate("/login");
    } catch (err) {
      let errorMessage = "Failed to delete account. Please try again.";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      Swal.fire("Error!", errorMessage, "error");
    }
  };

  return (
    <div className="flex items-center justify-center h-[500px] bg-gray-100">
      <div
        style={{ width: "800px" }}
        className="rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200 p-6">
        <h2 className="text-center text-2xl font-bold mb-6">Delete Account</h2>

        <form onSubmit={handleDelete} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded-sm px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="new-password"
              className="w-full border border-gray-300 rounded-sm px-3 py-2"
            />
          </div>

          {errors && <p className="text-red-600">{errors}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              className="w-1/2 px-4 py-2 bg-red-500 text-white rounded-sm hover:bg-red-600 transition cursor-pointer">
              Delete
            </button>
            <button
              type="button"
              className="w-1/2 border border-blue-500 text-blue-500 px-4 py-2 rounded-sm hover:bg-blue-50 transition cursor-pointer"
              onClick={() => navigate("/profile")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccountDelete;
