import { Link, useNavigate } from "react-router";
import Logo from "./Logo";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { IoIosMenu, IoMdClose, IoIosLogOut } from "react-icons/io";
import { useEffect, useState } from "react";

const navLinks = [
  { id: 1, title: "men" },
  { id: 2, title: "women" },
  { id: 3, title: "socks" },
  { id: 4, title: "new arrivals" },
];

const Navbar = () => {
  let isAdmin = localStorage.getItem("userRole") === "admin";
  const isAuthenticated = localStorage.getItem("userId") ? true : false;

  const navigate = useNavigate();

  const cartItems = 3;

  const [showDrawer, setShowDrawer] = useState(false);

  const handleLogOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <div
        className={`${
          showDrawer ? "block" : "hidden"
        } w-screen h-full absolute top-[100px] left-0 bg-light border-t-[1px] border-[#E5E5E5] shadow-lg z-20`}
      >
        <ul className="flex flex-col uppercase font-semibold text-xl divide-y-[1px] divide-[#EAEAEA] border-b-[1px] border-[#EAEAEA]">
          {navLinks.map((link) => (
            <Link key={link.id} to={`products/${link.title}`}>
              <li className="py-4 px-10 hover:underline hover:text-[#39523f]">
                {link.title}
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <div className="wrapper flex-between shadow-md h-[60px] sticky top-0 bg-light z-10 py-2">
        {isAdmin ? (
          <nav className="w-full flex-between">
            <div className="flex items-center gap-4">
              <Link to="/products" className=" hover:text-[#39523f]">
                Products
              </Link>
              <Link to="/categories" className=" hover:text-[#39523f]">
                Manage Categories
              </Link>
              <Link to="/admin/orders" className=" hover:text-[#39523f]">
                Manage Orders
              </Link>
              <Link to="/dashboard" className=" hover:text-[#39523f]">
                Dashboard
              </Link>
            </div>
            <IoIosLogOut
              size={24}
              className="hover:text-[#39523f] cursor-pointer "
              onClick={handleLogOut}
            />
          </nav>
        ) : (
          <div className="relative w-full flex-between">
            <nav className="lg:w-1/3 hidden lg:block">
              <ul className="flex items-center justify-start gap-6 uppercase font-semibold text-sm">
                {navLinks.map((link) => (
                  <Link key={link.id} to={`products/${link.title}`}>
                    <li className="py-4 px-10 hover:underline hover:text-[#39523f]">
                      {link.title}
                    </li>
                  </Link>
                ))}
              </ul>
            </nav>
            <div className="lg:hidden w-1/3">
              {showDrawer ? (
                <IoMdClose
                  size={30}
                  className="hover:text-[#39523f] cursor-pointer"
                  onClick={() => setShowDrawer(!showDrawer)}
                />
              ) : (
                <IoIosMenu
                  size={30}
                  className="hover:text-[#39523f] cursor-pointer"
                  onClick={() => setShowDrawer(!showDrawer)}
                />
              )}
            </div>

            <div className="justify-self-center text-center">
              <Logo />
            </div>
            <div className="w-1/3 flex items-center justify-end gap-6 uppercase font-semibold text-sm">
              <Link to="">
                <FiSearch size={24} className="hover:text-[#39523f]" />
              </Link>
              {/* //TODO Route will depends on the user's authentication status */}
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
              {isAuthenticated ? (
                <div className="flex gap-6">
                  <Link to={"/profile"}>
                    <FiUser size={24} className="hover:text-[#39523f]" />
                  </Link>
                  <IoIosLogOut
                    size={24}
                    className="hover:text-[#39523f] cursor-pointer"
                    onClick={handleLogOut}
                  />
                </div>
              ) : (
                <Link to={isAuthenticated ? "/profile" : "/login"}>
                  <FiUser size={24} className="hover:text-[#39523f]" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default Navbar;
