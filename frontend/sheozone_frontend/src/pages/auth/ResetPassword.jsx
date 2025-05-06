import { useState } from "react";
import Input from "../../components/Input";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Navigate } from "react-router-dom";

const ResetPassword = () => {
  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const uid = queryParams.get("uid");
  const token = queryParams.get("token");

  const navigate = useNavigate();

  // Redirect to reset request page if uid or token is missing
  if (!uid || !token) {
    return <Navigate to="/reset-password-request" replace />;
  }

  const handleInputChange = (e) => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!resetData.password) {
      newErrors.password = "Password is required";
    } else if (resetData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!resetData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (resetData.password !== resetData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const resetPasswordConfirm = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/password-reset-confirm/",
        {
          uid: uid,
          token: token,
          new_password: resetData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Password reset successfully");
      navigate("/login");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to reset password.";
      throw new Error(errorMessage);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    try {
      await resetPasswordConfirm();
      setSuccessMessage("Password reset successfully!");
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full rounded-2xl text-secondary px-6 py-10 bg-light">
      <div className="text-center mb-6">
        <h2 className="mb-6 text-2xl font-bold">Reset Password</h2>
        <p className="text-md text-gray-600">
          Enter a new password below to change your password
        </p>
      </div>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errors.general && <p className="text-red-500">{errors.general}</p>}
      <form className="space-y-6" onSubmit={handleResetPassword}>
        <Input
          label="New Password"
          type="password"
          name="password"
          value={resetData.password}
          onChange={handleInputChange}
          error={errors.password}
        />
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={resetData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
        />
        <button
          type="submit"
          className="w-full py-3 rounded-xs font-semibold transition-all bg-primary hover:bg-dark text-light cursor-pointer"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;