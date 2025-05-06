import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";
import { toast } from "react-toastify";

const ActivateAccount = () => {
  const { uidb64, token } = useParams(); // Extract uidb64 and token from URL
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/activate/${uidb64}/${token}/`
        );
        setMessage(response.data.detail); // e.g., "Account activated successfully"
        toast.success("Account activated successfully!");
      } catch (err) {
        const errorMessage =
          err.response?.data?.detail || "Failed to activate account.";
        setError(errorMessage);
      }
    };

    if (uidb64 && token) {
      activateAccount();
    } else {
      setError("Invalid activation link.");
    //   toast.error("Invalid activation link.");
    }
  }, [uidb64, token]);

  return (
    <div className="w-full h-full rounded-2xl text-secondary px-6 py-10 bg-light max-w-md mx-auto">
      <h2 className="text-center mb-8 text-2xl font-bold">Account Activation</h2>
      {message && (
        <div className="text-center">
          <p className="text-green-500 mb-4">{message}</p>
          <Link
            to="/login"
            className="text-primary hover:underline font-semibold"
          >
            Go to Login
          </Link>
        </div>
      )}
      {error && (
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            to="/register"
            className="text-primary hover:underline font-semibold"
          >
            Try Registering Again
          </Link>
        </div>
      )}
      {!message && !error && (
        <p className="text-center">Activating your account...</p>
      )}
    </div>
  );
};

export default ActivateAccount;