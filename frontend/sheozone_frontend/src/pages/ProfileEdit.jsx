import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../api";

function ProfileEdit() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    country: "",
    birthdate: "",
    mobile: "",
    profile_picture: null,
    facebook_profile: "",
  });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found. Please log in.");
      setMsg("User ID not found. Please log in.");
      return;
    }

    getUserProfile(userId)
      .then((res) => {
        const user = res.user;
        if (!user) throw new Error("User object is missing in response");
        setFormData({
          ...formData,
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          country: user.country || "",
          birthdate: user.birthdate || "",
          mobile: user.mobile || "",
          facebook_profile: user.facebook_profile || "",
          email: user.email || "",
          username: user.username || "",
        });
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setMsg("Error fetching profile data.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setMsg("");

    const newErrors = {};
    if (!formData.first_name || formData.first_name.trim() === "") {
      newErrors.first_name = "First name is required.";
    }

    if (!formData.last_name || formData.last_name.trim() === "") {
      newErrors.last_name = "Last name is required.";
    }

    if (!formData.mobile || formData.mobile.trim() === "") {
      newErrors.mobile = "Mobile field is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMsg("Please fix the errors before submitting.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found. Please log in.");
      setMsg("User ID not found. Please log in.");
      return;
    }

    const updateData = new FormData();
    for (let key in formData) {
      if (["email", "username"].includes(key)) {
        continue;
      }
      if (key === "profile_picture" && !formData[key]) {
        continue;
      }
      updateData.append(key, formData[key]);
    }

    try {
      await updateUserProfile(userId, updateData);
      setMsg("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      if (err.response?.data) {
        const backendErrors = err.response.data;
        if (backendErrors.error) {
          setMsg(backendErrors.error);
        } else if (
          typeof backendErrors === "object" &&
          backendErrors !== null
        ) {
          if (backendErrors.errors?.password) {
            setMsg(backendErrors.errors.password[0]);
          } else {
            setErrors(backendErrors.errors || {});
          }
        } else {
          setMsg(
            backendErrors.message || "There was an error updating the profile."
          );
        }
      } else {
        setMsg("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        style={{ width: "800px" }}
        className=" rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-2">
          <div className="text-center mb-5">
            <h3 className="text-2xl font-bold mb-3">Edit Profile</h3>
            {msg && (
              <div
                className={`p-3 rounded ${
                  msg.includes("successfully")
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                {msg}
              </div>
            )}
          </div>
        </h2>
        <p className="text-gray-700 text-base mb-4">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-4">
            {[
              { label: "First Name", name: "first_name" },
              { label: "Last Name", name: "last_name" },
              { label: "Country", name: "country" },
              { label: "Birthdate", name: "birthdate", type: "date" },
              { label: "Mobile", name: "mobile" },
              { label: "Facebook Account", name: "facebook_profile" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="block mb-1 font-medium">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors[name] && (
                  <p className="text-red-600 text-sm mt-1">
                    {Array.isArray(errors[name])
                      ? errors[name][0]
                      : errors[name]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="block mb-1 font-medium">Avatar</label>
              <input
                type="file"
                name="profile_picture"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.profile_picture && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.profile_picture}
                </p>
              )}
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Update
              </button>
            </div>
          </form>
        </p>
      </div>
    </div>
  );
}

export default ProfileEdit;
