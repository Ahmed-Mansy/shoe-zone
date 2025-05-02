import { useState } from "react";
import Input from "../../components/Input";
import ProfilePictureInput from "../../components/ProfilePictureInput";
import { registerUser } from "../../api";
import { useNavigate } from "react-router";

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
      setFormData({ ...formData, profilePicture: imageUrl });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    await registerUser(formData);
    navigate("/login");
  };

  return (
    <div className="w-full h-full rounded-2xl text-secondary px-6 py-10 bg-light">
      <h2 className="w-full text-center mb-14 text-2xl font-bold">Register</h2>

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
        />
        <Input
          label="Last Name"
          type="text"
          name="last_name"
          value={formData.last_name}
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
          className="w-full py-3 rounded-xs bg-primary text-light font-semibold hover:bg-dark transition-all cursor-pointer hover:opacity-90">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
