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
        setProfile(data);
        console.log("PROFILE DATA:", data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <Loading />;

  const user = profile || {};
  const addresses = user?.addresses || [];

  return (
    <div id="user-profile" className="wrapper my-5 py-5">
      <div className="flex flex-col md:flex-row divide-[#EAEAEA] divide-x-[2px]">
        <div className="w-full md:w-1/2 lg:w-1/4 p-4 pb-0">
          <div className="text-center py-4 rounded from-white-500 to-indigo-500 text-white">
            <img
              src={
                user?.profile_picture
                  ? `http://127.0.0.1:8000${user.profile_picture}`
                  : "/default-profile.png"
              }
              alt="profile"
              className="mx-auto border-2 border-white rounded-full my-3"
              style={{ width: 150, height: 150, objectFit: "cover" }}
            />
            <div className="space-y-2">
              <h4 className="font-bold text-2xl text-black">
                {user?.first_name || ""} {user?.last_name || ""}
              </h4>
              <p className="font-medium text-md text-black">{user?.email}</p>
              <div>
                <a
                  href={user?.facebook_profile || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-900">
                  <i className="fa-brands fa-facebook mx-1 text-3xl"></i>
                </a>
              </div>
            </div>
          </div>
          <ul className="flex flex-col pt-4 border-y-[2px] border-[#EAEAEA] bg-white divide-y-[2px] divide-[#EAEAEA] text-lg font-semibold">
            <li className="py-4 px-4">
              <Link
                to="/profile/edit"
                className="text-black hover:underline inline-block">
                Edit Profile
              </Link>
            </li>
            <li className="py-4 px-4">
              <Link
                to="/profile/update-address"
                className="text-black hover:underline inline-block">
                Edit Address
              </Link>
            </li>
            <li className="py-4 px-4">
              <Link
                to="/profile/delete"
                className="text-red-600 hover:underline inline-block">
                Delete Account
              </Link>
            </li>
          </ul>
        </div>
        <div className="w-full md:w-1/2 lg:w-3/4 flex flex-col gap-10 lg:gap-0 lg:flex-row p-4 divide-x-[2px]  md:divide-x-0 divide-[#EAEAEA]">
          <div className="w-full lg:w-1/2 pb-8">
            <div className="w-fit text-black border-b-[2px] border-[#EAEAEA]">
              <h3 className="mb-4 text-xl font-bold">Profile Details</h3>
            </div>
            <div className="mt-4 ml-4 md:ml-10 text-gray-800 space-y-4 text-lg">
              <p>
                <strong>First Name:</strong> {user?.first_name || "-"}
              </p>
              <p>
                <strong>Last Name:</strong> {user?.last_name || "-"}
              </p>
              <p>
                <strong>Email:</strong> {user?.email || "-"}
              </p>
              <p>
                <strong>Mobile:</strong> {user?.mobile || "Not provided"}
              </p>
              <p>
                <strong>Birthday:</strong> {user?.birthdate || "Not provided"}
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/2 pl-2">
            <div className="w-fit text-black border-b-[2px] border-[#EAEAEA]">
              <h3 className="mb-4 text-xl font-bold">Home Address</h3>
            </div>

            {addresses.length > 0 ? (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className="mt-4 ml-4 md:ml-10 text-gray-800 space-y-4 text-lg">
                  {address?.country && (
                    <p>
                      <strong>Country:</strong> {address.country}
                    </p>
                  )}
                  {address?.city && (
                    <p>
                      <strong>City:</strong> {address.city}
                    </p>
                  )}
                  {address?.address_line_1 && (
                    <p>
                      <strong>Street, House number:</strong>{" "}
                      {address?.address_line_1}
                    </p>
                  )}
                  {address?.postcode && (
                    <p>
                      <strong>Postcode:</strong> {address.postcode}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-8 text-xl">
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
