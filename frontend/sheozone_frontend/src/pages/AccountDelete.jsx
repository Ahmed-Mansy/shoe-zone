import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUserAccount } from "../api";

function AccountDelete() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (!confirmDelete) return;

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("User ID not found. Please log in.");
        setErrors("User ID not found. Please log in.");
        return;
      }

      console.log("Sending:", { password, user_id: userId });
      await deleteUserAccount(userId, password);
      setMsg("Account deleted successfully.");
      localStorage.clear(); // Clear localStorage after account deletion
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.errors?.password) {
        setMsg(err.response.data.errors.password[0]);
      } else if (err.response?.data?.error) {
        setMsg(err.response.data.error);
      } else {
        setMsg("Failed to delete account.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        style={{ width: "800px" }}
        className="rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200 p-6"
      >
        <h2 className="text-center text-2xl font-bold mb-6">Delete Account</h2>

        <div className="pb-4 text-left">
          <h4 className="text-lg font-semibold mb-2">
            Confirm password to delete your account
          </h4>
          {msg && (
            <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-2">
              {msg}
            </div>
          )}
          {errors && <p className="text-red-600">{errors}</p>}
        </div>

        <form onSubmit={handleDelete} className="space-y-4">
          <div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="w-1/2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Delete
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
}

export default AccountDelete;
