import Input from "../components/Input";
import Logo from "../components/Logo";
import ProfilePictureInput from "../components/ProfilePictureInput";
import { useState } from "react";
const Register = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setFormData({ ...formData, profilePicture: imageUrl });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="w-full h-full rounded-2xl text-secondary px-6 py-10 bg-light">
      <div className="w-full flex-center">
        <Logo goHome={false} />
      </div>
      <h2 className="my-6 text-2xl font-bold">Register</h2>
      <form className="space-y-6" onSubmit={handleRegister}>
        <ProfilePictureInput
          handleImageChange={handleImageChange}
          selectedImage={selectedImage}
          previewUrl={previewUrl}
        />
        <Input
          label="First Name"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
        />
        <Input
          label="Last Name"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
        />
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
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
