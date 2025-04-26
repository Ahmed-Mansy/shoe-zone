import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios"; // Axios instance for API calls

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found. Please log in.");
          return;
        }

        const response = await api.get(`/users/profile/${userId}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile || !profile.user) return <div className="text-center py-4">Loading...</div>;

  const user = profile.user;

  return (
    <div id="user-profile" className="container mx-auto py-8">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <img
          src={user.profile_picture ? `http://127.0.0.1:8000/${user.profile_picture}` : "/default-profile.png"}
          alt="profile"
          className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-md object-cover"
        />
        <h2 className="text-2xl font-semibold mt-4">{user.first_name} {user.last_name}</h2>
        <p className="text-gray-600 text-sm">{user.email}</p>
        <div className="mt-4">
          <a href={user.facebook_profile || "#"} target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-facebook text-blue-600 text-3xl mx-2"></i>
          </a>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Profile Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p><strong>First Name:</strong> {user.first_name}</p>
            <p><strong>Last Name:</strong> {user.last_name}</p>
            <p><strong>Country:</strong> {user.country}</p>
          </div>
          <div>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Mobile:</strong> {user.mobile}</p>
            <p><strong>Birthday:</strong> {user.birthdate}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col space-y-4 mb-8">
        <Link to="/profile/edit" className="btn btn-primary py-2 px-4 text-white bg-blue-600 rounded hover:bg-blue-700">
          Edit Profile
        </Link>
        <Link to="/profile/delete" className="btn btn-danger py-2 px-4 text-white bg-red-600 rounded hover:bg-red-700">
          Delete Account
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
