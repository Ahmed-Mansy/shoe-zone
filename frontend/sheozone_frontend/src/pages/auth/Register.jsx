// import { useState } from "react";
// import Input from "../../components/Input";
// import ProfilePictureInput from "../../components/ProfilePictureInput";
// import { registerUser } from "../../api";
// import { useNavigate } from "react-router";

// const Register = () => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);

//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     profilePicture: null,
//   });

//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedImage(file);
//       const imageUrl = URL.createObjectURL(file);
//       setPreviewUrl(imageUrl);
//       setFormData({ ...formData, profilePicture: file });
//     }
//   };

//   // const handleRegister = async (e) => {
//   //   e.preventDefault();
//   //   await registerUser(formData);
//   //   navigate("/login");
//   // };

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     const formDataToSend = new FormData();
//     formDataToSend.append("first_name", formData.first_name);
//     formDataToSend.append("last_name", formData.last_name);
//     formDataToSend.append("email", formData.email);
//     formDataToSend.append("password", formData.password);
//     formDataToSend.append("profile_picture", formData.profilePicture);

//     await registerUser(formDataToSend);
//     navigate("/login");
//   };

//   return (
//     <div className="w-full h-full rounded-2xl text-secondary px-6 py-10 bg-light">
//       <h2 className="w-full text-center mb-14 text-2xl font-bold">Register</h2>

//       <form className="space-y-6" onSubmit={handleRegister}>
//         <ProfilePictureInput
//           handleImageChange={handleImageChange}
//           selectedImage={selectedImage}
//           previewUrl={previewUrl}
//         />
//         <Input
//           label="First Name"
//           type="text"
//           name="first_name"
//           value={formData.first_name}
//           onChange={handleInputChange}
//         />
//         <Input
//           label="Last Name"
//           type="text"
//           name="last_name"
//           value={formData.last_name}
//           onChange={handleInputChange}
//         />
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
//         <Input
//           label="Confirm Password"
//           type="password"
//           name="confirmPassword"
//           value={formData.confirmPassword}
//           onChange={handleInputChange}
//         />
//         <button
//           type="submit"
//           className="w-full py-3 rounded-xs bg-primary text-light font-semibold hover:bg-dark transition-all cursor-pointer hover:opacity-90">
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;

import { useState } from "react";
import Input from "../../components/Input";
import ProfilePictureInput from "../../components/ProfilePictureInput";
import { registerUser } from "../../api";
import { useNavigate } from "react-router";
import Logo from "../../components/Logo";

const Register = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setFormData({ ...formData, profilePicture: file });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("first_name", formData.first_name);
    formDataToSend.append("last_name", formData.last_name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    if (formData.profilePicture) {
      formDataToSend.append("profile_picture", formData.profilePicture);
    }

    try {
      await registerUser(formDataToSend);
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="w-full h-full rounded-2xl text-secondary px-6 py-10 bg-light ">
      {/* <h2 className="w-full text-center mb-14 text-2xl font-bold">Register</h2> */}
<div className="justify-self-center text-center py-6">
              <Logo />
            </div>
      <form className="space-y-6" onSubmit={handleRegister}>
        <ProfilePictureInput
          handleImageChange={handleImageChange}
          selectedImage={selectedImage}
          previewUrl={previewUrl}
        />

        <Input
          label="First Name"
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
          error={errors.first_name}
        />
        <Input
          label="Last Name"
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
          error={errors.last_name}
        />
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
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xs bg-primary text-light font-semibold hover:bg-dark transition-all cursor-pointer hover:opacity-90">
          Register
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <a href="/login" className="text-primary hover:underline">
          Login 
        </a>  
        </div>
    </div>
  );
};

export default Register;
