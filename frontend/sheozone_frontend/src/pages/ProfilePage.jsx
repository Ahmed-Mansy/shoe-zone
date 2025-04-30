import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserProfile } from "../api";


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
        const data = await getUserProfile(userId);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile || !profile.user) return <div className="text-center py-4">Loading...</div>;

  const user = profile.user;
  const addresses = user.addresses || [];

  return (
    <div id="user-profile" className="container my-5 py-5">
      <div className="row">
      {/* Profile Header */}
      <div className="col-md-3 profile-nav shadow-lg h-100 p-0">
      <div className="user-heading round bg-gradient-primary text-center py-4">
        <img
          src={user.profile_picture ? `http://127.0.0.1:8000/${user.profile_picture}` : "/default-profile.png"}
          alt="profile"
          className="card-img-top border border-2 rounded-circle my-3"
          style={{ width: 150, height: 150, objectFit: "cover" }}
            
        />
        <h4>
              {user.first_name} {user.last_name}
            </h4>
            <p>{user.email}</p>
            <a href={user.facebook_profile || "#"} target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-facebook mx-1"></i>
            </a>
          </div>
          <ul className="nav flex-column bg-white">
            <li className="py-1">
              <Link to={`/profile/edit`} className="btn btn-link">
                Edit Profile
              </Link>
            </li>
            <li className="py-1">
              <Link to="/profile/update-address" className="btn btn-link">
                Edit Address
              </Link>
            </li>
            <li className="py-1">
              <Link to="/profile/delete" className="btn btn-link">
                Delete Account
              </Link>
            </li>
          </ul>
        </div>

        

        {/* Right Content */}
        <div className="col-md-9">
          <div className="row">
          {/* Profile Details */}
          <div className="col-md-9">
          <div className="profile-info w-75 mx-auto shadow-lg text-black rounded px-5 py-4 d-flex flex-column align-items-center" style={{ backgroundColor: "#d0ebff" }}>


              <h3 className="mb-4">Profile Details</h3>
                </div>
              <p><strong>First Name:</strong> {user.first_name}</p>
              <p><strong>Last Name:</strong> {user.last_name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Mobile:</strong> {user.mobile}</p>
              <p><strong>Country:</strong> {user.country}</p>
              <p><strong>Birthday:</strong> {user.birthdate || "-"}</p>
            </div>
          </div>

          {/* Home Address */}
          
            <div className="col-md-9">
            <div className="w-75 mx-auto profile-info shadow-lg text-black rounded px-5 py-4 d-flex flex-column align-items-center mt-5" style={{ backgroundColor: "#d0ebff" }}>
                  <h3 className="mb-4 text-center w-100">Home Address</h3>
                </div>
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <div key={address.id} className="text-start px-4  mt-3 text-black">
                  {address.country && <p><strong>Country:</strong> {address.country}</p>}
                  {address.city && <p><strong>City:</strong> {address.city}</p>}
                  {address.address_line_1 && <p><strong>Street, House number:</strong> {address.address_line_1}</p>}
                  {address.postcode && <p><strong>Postcode:</strong> {address.postcode}</p>}
                </div>
              ))
              
            ) : (
              <p className="text-gray-500">No address added yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
