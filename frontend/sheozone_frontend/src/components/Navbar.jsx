import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-gray-800">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <div className="text-white text-xl font-bold">
        <Link to="/">Shoe Zone</Link>
      </div>
      <div>
        <Link to="/products" className="text-gray-300 hover:text-white mx-2">Products</Link>
        <Link to="/categories" className="text-gray-300 hover:text-white mx-2">Manage Categories</Link>
        <Link to="/admin/orders" className="text-gray-300 hover:text-white mx-2">Manage Orders</Link>
        <Link to="/dashboard" className="text-gray-300 hover:text-white mx-2">Dashboard</Link>
        <Link to="/contact" className="text-gray-300 hover:text-white mx-2">Contact</Link>
      </div>
    </div>
  </nav>
);
export default Navbar;