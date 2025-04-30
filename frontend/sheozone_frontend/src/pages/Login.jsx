import { Link } from "react-router";
import Input from "../components/Input";
import Logo from "../components/Logo";
import { useState } from "react";
import { loginUser } from "../api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser(formData);
  };

  return (
    <div className="w-full h-full rounded-2xl text-secondary px-6 py-10 bg-light">
      <div className="w-full flex-center">
        <Logo goHome={false} />
      </div>
      <h2 className="my-6 text-2xl font-bold">Login</h2>
      <form className="space-y-6" onSubmit={handleLogin}>
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <p className="text-md -mt-3">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default Login;
