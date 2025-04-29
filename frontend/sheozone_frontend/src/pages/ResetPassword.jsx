import { useState } from "react";
import Input from "../components/Input";
import { Link } from "react-router";

const ResetPassword = () => {
  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    console.log(resetData);
  };

  return (
    <div className="w-full h-full rounded-2xl text-secondary px-6 py-10 bg-light">
      <div className="text-center mb-6">
        <h2 className="mb-6 text-2xl font-bold">Reset Password</h2>
        <p className="text-md text-gray-600">
          Enter a new password below to change your password
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleResetPassword}>
        <Input
          label="New Password"
          type="password"
          name="password"
          value={resetData.password}
          onChange={handleInputChange}
        />
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={resetData.confirmPassword}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="w-full rounded-md cursor-pointer bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
