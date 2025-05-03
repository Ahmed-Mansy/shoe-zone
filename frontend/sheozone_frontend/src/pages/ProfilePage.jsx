import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserProfile } from "../api";
import Loading from "../components/Loading";

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
        console.log(userId);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile || !profile.user) return <Loading />;

  const user = profile.user;
  const addresses = user.addresses || [];

  return (
    <div id="user-profile" className="container mx-auto my-5 py-5">
      <div className="flex flex-wrap">
        <div className="w-1/3 bg-gray-100 p-4">
          <div className="text-center py-4 rounded bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <img
              src={
                user.profile_picture
                  ? `http://127.0.0.1:8000/${user.profile_picture}`
                  : "/default-profile.png"
              }
              alt="profile"
              className="mx-auto border-2 border-white rounded-full my-3"
              style={{ width: 150, height: 150, objectFit: "cover" }}
            />
            <h4
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "black",
              }}>
              {user.first_name} {user.last_name}
            </h4>
            <p style={{ fontSize: "0.875rem", color: "black" }}>{user.email}</p>
            <div>
              <a
                href={user.facebook_profile || "#"}
                target="_blank"
                rel="noopener noreferrer">
                <i
                  className="fa-brands fa-facebook mx-1 text-xl"
                  style={{ color: "black" }}></i>
              </a>
            </div>
          </div>
          <ul className="flex flex-col bg-white divide-y">
            <li className="py-2 px-4">
              <Link
                to="/profile/edit"
                className="text-blue-600 hover:underline inline-block">
                Edit Profile
              </Link>
            </li>
            <li className="py-2 px-4">
              <Link
                to="/profile/update-address"
                className="text-blue-600 hover:underline inline-block">
                Edit Address
              </Link>
            </li>
            <li className="py-2 px-4">
              <Link
                to="/profile/delete"
                className="text-red-600 hover:underline inline-block">
                Delete Account
              </Link>
            </li>
          </ul>
        </div>
        <div className="w-2/3 bg-gray-200 p-4">
          <div className="w-full md:w-3/4">
            <div
              className="w-3/4 mx-auto shadow-lg text-black rounded px-5 py-4 flex flex-col items-center"
              style={{ backgroundColor: "#d0ebff" }}>
              <h3 className="mb-4 text-xl font-bold">Profile Details</h3>
            </div>
            <div className="w-3/4 mx-auto mt-4 text-gray-800 space-y-2">
              <p>
                <strong>First Name:</strong> {user.first_name}
              </p>
              <p>
                <strong>Last Name:</strong> {user.last_name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Mobile:</strong> {user.mobile}
              </p>
              <p>
                <strong>Country:</strong> {user.country}
              </p>
              <p>
                <strong>Birthday:</strong> {user.birthdate || "-"}
              </p>
            </div>
          </div>
          <div className="w-full md:w-3/4 mt-8">
            <div
              className="w-3/4 mx-auto shadow-lg text-black rounded px-5 py-4 flex flex-col items-center"
              style={{ backgroundColor: "#d0ebff" }}>
              <h3 className="mb-4 text-center w-full text-xl font-bold">
                Home Address
              </h3>
            </div>

            {addresses.length > 0 ? (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className="text-start px-4 mt-3 text-black w-3/4 mx-auto">
                  {address.country && (
                    <p>
                      <strong>Country:</strong> {address.country}
                    </p>
                  )}
                  {address.city && (
                    <p>
                      <strong>City:</strong> {address.city}
                    </p>
                  )}
                  {address.address_line_1 && (
                    <p>
                      <strong>Street, House number:</strong>{" "}
                      {address.address_line_1}
                    </p>
                  )}
                  {address.postcode && (
                    <p>
                      <strong>Postcode:</strong> {address.postcode}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-4">
                No address added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
