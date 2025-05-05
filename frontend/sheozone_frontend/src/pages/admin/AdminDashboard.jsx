import { useEffect, useState } from "react";
import { Link } from "react-router";
// import { getDashboardStats } from "../../api";
import Loading from "../../components/Loading";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const authToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!authToken) {
      setError("Unauthorized access. Please log in.");
      return;
    }

    const getDashboardStats = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/orders/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setStats(res.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError("Error fetching data. Please try again later.");
      }
    };

    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      setError("Access denied. You are not authorized to view this page.");
      return;
    }

    getDashboardStats();
  }, [authToken]);

  if (error) return <div>{error}</div>;
  if (!stats) return <Loading />;

  return (
    // <div className="p-6">
    //   <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>

    //   <div className="container flex justify-center items-center w-full">
    //     <div className="row flex justify-center items-center w-full">
    //       <div className="rounded-xl p-6 shadow-lg w-1/2 m-4 text-center font-bold bg-gray-100">
    //         <div className="text-gray-600 font-bold text-center">
    //           Total Users
    //         </div>
    //         <div className="text-2xl font-bold m-3">{stats.total_users}</div>
    //         <Link
    //           to="/admin/users"
    //           className="bg-blue-500 text-white py-2 px-4 rounded ">
    //           Manage Users
    //         </Link>
    //       </div>
    //     </div>

    //     <div className="row flex justify-center items-center w-full">
    //       <div className="rounded-xl p-6 shadow-lg w-1/2 m-4 text-center font-bold bg-gray-100">
    //         <div className="text-gray-600 font-bold text-center">
    //           Total Orders
    //         </div>
    //         <div className="text-2xl font-bold m-3">{stats.total_orders}</div>
    //         <Link
    //           to="/admin/orders"
    //           className="bg-blue-500 text-white py-2 px-4 rounded">
    //           All Orders
    //         </Link>
    //       </div>
    //     </div>

    //     <div className="row flex justify-center items-center w-full">
    //       <div className="rounded-xl p-6 shadow-lg w-1/2 m-4 text-center font-bold bg-gray-100 mb-5">
    //         <div className="text-gray-600 font-bold text-center">
    //           Total Sales
    //         </div>
    //         <div className="text-2xl font-bold m-3">${stats.total_sales}</div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>

      <div className="flex flex-col gap-6 items-center w-full">
        {/* Users Card */}
        <div className="rounded-xl p-6 shadow-lg w-full max-w-md text-center bg-gray-100">
          <div className="text-gray-600 font-bold mb-2">Total Users</div>
          <div className="text-2xl font-bold mb-4">{stats.total_users}</div>
          <Link
            to="/admin/users"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">
            Manage Users
          </Link>
        </div>

        {/* Orders Card */}
        <div className="rounded-xl p-6 shadow-lg w-full max-w-md text-center bg-gray-100">
          <div className="text-gray-600 font-bold mb-2">Total Orders</div>
          <div className="text-2xl font-bold mb-4">{stats.total_orders}</div>
          <Link
            to="/admin/orders"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">
            All Orders
          </Link>
        </div>

        {/* Sales Card */}
        <div className="rounded-xl p-6 shadow-lg w-full max-w-md text-center bg-gray-100">
          <div className="text-gray-600 font-bold mb-2">Total Sales</div>
          <div className="text-2xl font-bold">${stats.total_sales}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
