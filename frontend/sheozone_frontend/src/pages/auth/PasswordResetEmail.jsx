import { useState } from "react";
import Input from "../../components/Input";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const PasswordResetEmail = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const validateEmail = () => {
    let newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    return newErrors;
  };

  const sendPasswordResetEmail = async (email) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/password-reset-request/",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.email || "Failed to send reset email."
      );
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const validationErrors = validateEmail();

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      const response = await sendPasswordResetEmail(email);
      toast.success("Check your inbox for the reset instructions!");

      const resetUrl = response.reset_url;
      const urlParams = new URLSearchParams(new URL(resetUrl).search);
      const uid = urlParams.get("uid");
      const token = urlParams.get("token");

      navigate("/reset-password", { state: { uid, token } });
    } catch (err) {
      setError({ email: err.message || "Failed to send reset email." });
    }
  };

  return (
    <div className="w-full h-full rounded-2xl text-secondary px-6 py-10 bg-light">
      <div className="text-center mb-6">
        <h2 className="mb-6 text-2xl font-bold">Reset Password</h2>
        <p className="text-md text-gray-600">
          Enter your email to receive a password reset link
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleResetPassword}>
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          error={error.email}
        />
        <button
          type="submit"
          className="w-full py-3 rounded-xs font-semibold transition-all bg-primary hover:bg-dark text-light cursor-pointer">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default PasswordResetEmail;
