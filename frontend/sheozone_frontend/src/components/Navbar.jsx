import { Link } from "react-router";
import Logo from "./Logo";
import { FiSearch, FiUser, FiHelpCircle, FiShoppingCart } from "react-icons/fi";

const Navbar = () => {
  const isAdmin = localStorage.getItem("userRole") === "admin";

  return (
    <div className="wrapper flex-between shadow-md h-[60px] sticky top-0 bg-light z-10 py-2">
      {isAdmin ? (
        <div>
          <Link to="/products" className="text-gray-300 hover:text-white mx-2">
            Products
          </Link>
          <Link
            to="/categories"
            className="text-gray-300 hover:text-white mx-2">
            Manage Categories
          </Link>
          <Link
            to="/admin/orders"
            className="text-gray-300 hover:text-white mx-2">
            Manage Orders
          </Link>
          <Link to="/dashboard" className="text-gray-300 hover:text-white mx-2">
            Dashboard
          </Link>
        </div>
      ) : (
        <>
          <nav>
            <ul className="flex-between gap-6 uppercase font-semibold text-sm">
              <li className="cursor-pointer hover:underline hover:text-[#39523f]">
                men
              </li>
              <li className="cursor-pointer hover:underline hover:text-[#39523f]">
                women
              </li>
              <li className="cursor-pointer hover:underline hover:text-[#39523f]">
                socks
              </li>
              <li className="cursor-pointer hover:underline hover:text-[#39523f]">
                new arrivals
              </li>
            </ul>
          </nav>
          <Logo />
          <ul className="flex-between gap-6 uppercase font-semibold text-sm">
            <li className="cursor-pointer hover:underline hover:text-[#39523f]">
              <Link to="/stores">stores</Link>
            </li>
            <li className="cursor-pointer">
              <FiSearch size={24} className="hover:text-[#39523f]" />
            </li>
            {/* //TODO Route will depends on the user's authentication status */}
            <li className="cursor-pointer">
              <Link to="/profile">
                <FiUser size={24} className="hover:text-[#39523f]" />
              </Link>
            </li>
            <li className="cursor-pointer">
              <FiHelpCircle size={24} className="hover:text-[#39523f]" />
            </li>
            <li className="cursor-pointer">
              <Link to="/cart">
                <FiShoppingCart size={24} className="hover:text-[#39523f]" />
              </Link>
            </li>
          </ul>
        </>
      )}
    </div>
  );
};
export default Navbar;
