// import { Link } from "react-router";
// import Input from "../../components/Input";
// import { useState } from "react";
// import { loginUser } from "../../api";
// import { useNavigate } from "react-router";

// const Login = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     let response = await loginUser(formData);
//     localStorage.setItem("access", response.access);
//     navigate("/");
//   };

//   return (
//     <div className="w-full rounded-2xl text-secondary px-6 py-10 bg-light">
//       <h2 className="w-full text-center mb-14 text-2xl font-bold">Login</h2>

//       <form className="space-y-6" onSubmit={handleLogin}>
//         <Input
//           label="Email"
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleInputChange}
//         />
//         <Input
//           label="Password"
//           type="password"
//           name="password"
//           value={formData.password}
//           onChange={handleInputChange}
//         />
//         <p className="text-md -mt-3">
//           Don&apos;t have an account?
//           <Link to="/register" className="text-blue-600">
//             Register
//           </Link>
//         </p>
//         <button
//           type="submit"
//           className="w-full py-3 rounded-xs bg-primary text-light font-semibold hover:bg-dark transition-all cursor-pointer hover:opacity-90">
//           Sign in
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;

import { Link, useNavigate } from "react-router";
import { useState } from "react";
import Input from "../../components/Input";
import { loginUser } from "../../api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await loginUser(formData);
      if (response.access) {
        localStorage.setItem("access", response.access);
        navigate("/");
      } else {
        setServerError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setServerError(
        error?.response?.data?.detail ||
          "Wrong email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl text-secondary px-6 py-10 bg-light max-w-md mx-auto">
      <h2 className="text-center mb-8 text-2xl font-bold">Login</h2>

      <form className="space-y-6" onSubmit={handleLogin}>
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
        />

        {serverError && (
          <div className="text-red-600 text-sm text-center mt-2">
            {serverError}
          </div>
        )}

        <p className="text-md mt-3">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>

        <p className="text-md -mt-4">
          <Link
            to="/reset-password-request"
            className="text-blue-600 hover:underline">
            Forgot Password ?
          </Link>
        </p>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xs font-semibold transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-dark text-light cursor-pointer"
          }`}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default Login;
