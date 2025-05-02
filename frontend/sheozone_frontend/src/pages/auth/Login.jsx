import { Link } from "react-router";
import Input from "../../components/Input";
import { useState } from "react";
import { loginUser } from "../../api";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let respone = await loginUser(formData);

    navigate("/");
  };

  return (
    <div className="w-full rounded-2xl text-secondary px-6 py-10 bg-light">
      <h2 className="w-full text-center mb-14 text-2xl font-bold">Login</h2>

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
          Don&apos;t have an account?
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
        <button
          type="submit"
          className="w-full py-3 rounded-xs bg-primary text-light font-semibold hover:bg-dark transition-all cursor-pointer hover:opacity-90">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default Login;
