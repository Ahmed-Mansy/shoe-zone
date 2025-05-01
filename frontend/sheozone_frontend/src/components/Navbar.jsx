import { Link } from "react-router";
import Logo from "./Logo";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { IoIosMenu } from "react-icons/io";
import { useState } from "react";

const Navbar = () => {
  const isAdmin = localStorage.getItem("userRole") === "admin";
  // const isAdmin = false;

  const isLoggedIn = false;
  const cartItems = 3;

  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <div
        className={`${
          showDrawer ? "block" : "hidden"
        } w-screen h-full absolute top-[100px] left-0 bg-light border-t-[1px] border-[#E5E5E5] shadow-lg z-20`}>
        <ul className="flex flex-col uppercase font-semibold text-xl divide-y-[1px] divide-[#EAEAEA] border-b-[1px] border-[#EAEAEA]">
          <li className="py-4 px-10 cursor-pointer hover:underline hover:text-[#39523f]">
            men
          </li>
          <li className="py-4 px-10 cursor-pointer hover:underline hover:text-[#39523f]">
            women
          </li>
          <li className="py-4 px-10 cursor-pointer hover:underline hover:text-[#39523f]">
            socks
          </li>
          <li className="py-4 px-10 cursor-pointer hover:underline hover:text-[#39523f]">
            new arrivals
          </li>
        </ul>
      </div>
      <div className="wrapper flex-between shadow-md h-[60px] sticky top-0 bg-light z-10 py-2">
        {isAdmin ? (
          <nav className="w-full">
            <Link to="/products" className=" hover:text-[#39523f] mx-2">
              Products
            </Link>
            <Link to="/categories" className=" hover:text-[#39523f] mx-2">
              Manage Categories
            </Link>
            <Link to="/admin/orders" className=" hover:text-[#39523f] mx-2">
              Manage Orders
            </Link>
            <Link to="/dashboard" className=" hover:text-[#39523f] mx-2">
              Dashboard
            </Link>
          </nav>
        ) : (
          <div className="relative w-full flex-between">
            <nav className="lg:w-1/3 hidden lg:block">
              <ul className="flex items-center justify-start gap-6 uppercase font-semibold text-sm">
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
            <div className="lg:hidden w-1/3">
              <IoIosMenu
                size={30}
                className="hover:text-[#39523f] cursor-pointer"
                onClick={() => setShowDrawer(!showDrawer)}
              />
            </div>

            <div className="justify-self-center text-center">
              <Logo />
            </div>
            <div className="w-1/3 flex items-center justify-end gap-6 uppercase font-semibold text-sm">
              <Link to="">
                <FiSearch size={24} className="hover:text-[#39523f]" />
              </Link>
              {/* //TODO Route will depends on the user's authentication status */}
              <Link to={isLoggedIn ? "/profile" : "/login"}>
                <FiUser size={24} className="hover:text-[#39523f]" />
              </Link>
              <div className="relative">
                <Link to="/cart">
                  <FiShoppingCart
                    size={24}
                    className="hover:text-[#39523f]z-10"
                  />
                </Link>
                <span className="w-5 h-5 rounded-full bg-black absolute -top-3 -right-3 -z-10 text-light flex-center text-sm font-medium">
                  {cartItems}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default Navbar;
