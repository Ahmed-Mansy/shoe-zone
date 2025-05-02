import React, { useState, useEffect } from "react";
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
  console.log(formData);
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
        console.log("PROFILE RESPONSE:", user);
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
      console.log(updateData);
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
    <div className="container py-5">
      <div className="col-md-8 card shadow-lg p-4 mt-5 mx-auto">
        <div className="text-center">
          <h3 className="font-weight-bolder">Edit Profile</h3>
          {msg && (
            <div
              className={`alert ${
                msg.includes("successfully") ? "alert-success" : "alert-warning"
              }`}
            >
              {msg}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {[
            { label: "First Name", name: "first_name" },
            { label: "Last Name", name: "last_name" },
            { label: "Country", name: "country" },
            { label: "Birthdate", name: "birthdate", type: "date" },
            { label: "Mobile", name: "mobile" },
            { label: "Facebook Account", name: "facebook_profile" },
          ].map(({ label, name, type = "text" }) => (
            <div className="mb-3" key={name}>
              <label className="form-label">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                className="form-control"
              />
              {errors[name] && (
                <div className="text-danger">
                  {Array.isArray(errors[name]) ? errors[name][0] : errors[name]}
                </div>
              )}
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">Avatar</label>
            <input
              type="file"
              name="profile_picture"
              onChange={handleChange}
              className="form-control"
            />
            {errors.profile_picture && (
              <div className="text-danger">{errors.profile_picture}</div>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-lg bg-gradient-primary w-100 mt-4 mb-0"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileEdit;