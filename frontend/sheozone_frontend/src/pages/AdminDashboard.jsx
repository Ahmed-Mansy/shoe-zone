import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { getDashboardStats } from '../api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then((data) => setStats(data));
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className=" p-6 ">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>   

      <div className="container flex justify-center items-center w-50">

        <div className="row flex justify-center items-center w-75">
          <div className='rounded-xl p-6 shadow-lg w-1/2 m-4 text-center font-bold bg-green-100 p-5 m-4'>
            <div className="text-gray-600 font-bold text-center">Total Users</div>
            <div className='text-2xl font-bold m-3'>{stats.total_users}</div>
            <Link to="/admin/users" className="btn btn-primary">Manage Users</Link>
          </div>
          
        </div>

        <div className="row flex justify-center items-center w-75 ">
          <div className='rounded-xl p-6 shadow-lg w-1/2 m-4 text-center font-bold bg-green-100 p-5 m-4'>
            <div className="text-gray-600 font-bold text-center">Total Orders</div>
            <div className='text-2xl font-bold m-3'>{stats.total_orders}</div>
            <Link to="/dashboard" className="btn btn-primary">All Orders</Link>
          </div>
          
        </div>

        <div className="row flex justify-center items-center w-75">
          <div className='rounded-xl p-6 shadow-lg w-1/2 m-4 text-center font-bold bg-green-100 p-5 m-4 mb-5'>
            <div className="text-gray-600 font-bold text-center">Total Sales</div>
            <div className='text-2xl font-bold m-3'>${stats.total_sales}</div>
          </div>
        </div>

      </div>
      
    </div>
  );
};

export default AdminDashboard;
