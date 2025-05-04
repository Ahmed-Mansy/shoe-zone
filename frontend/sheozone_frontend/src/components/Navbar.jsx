import { Link, useNavigate } from "react-router";
import Logo from "./Logo";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { IoIosMenu, IoMdClose, IoIosLogOut } from "react-icons/io";
import { IoChevronDownOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { getSubCategories } from "../api";
import { useCart } from "../context/CartContext";

const navLinks = [
  {
    id: 1,
    title: "men",
  },
  {
    id: 2,
    title: "women",
  },
];

const Navbar = () => {
  const [subCategories, setSubCategories] = useState({});
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { cartCount, fetchCartItems } = useCart();
  const navigate = useNavigate();

  let isAdmin = localStorage.getItem("userRole") === "admin";
  const isAuthenticated = localStorage.getItem("userId") ? true : false;

  useEffect(() => {
    fetchCartItems();

    const fetchAllSubCategories = async () => {
      const allSubCats = {};
      for (const link of navLinks) {
        const result = await getSubCategories(link.title);
        allSubCats[link.title] = result;
      }
      setSubCategories(allSubCats);
    };

    fetchAllSubCategories();
  }, [fetchCartItems]);

  const handleLogOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleSubMenu = (title) => {
    setActiveDropdown((prev) => (prev === title ? null : title));
  };

  return (
    <>
      {/* Drawer */}
      <div
        className={`${
          showDrawer ? "block" : "hidden"
        } w-screen h-full absolute top-[100px] left-0 bg-light border-t-[1px] border-[#E5E5E5] shadow-lg z-20 lg:hidden`}>
        <ul className="flex flex-col uppercase font-semibold text-xl divide-y-[1px] divide-[#EAEAEA] border-b-[1px] border-[#EAEAEA]">
          {navLinks.map((link) => (
            <div key={link.id} className="relative">
              <li
                onClick={() => handleSubMenu(link.title)}
                className="py-4 px-10 hover:underline hover:text-[#39523f] flex justify-between items-center cursor-pointer">
                {link.title}
                <IoChevronDownOutline
                  size={20}
                  className={`transition-transform duration-300 ${
                    activeDropdown === link.title ? "rotate-180" : ""
                  }`}
                />
              </li>
              <ul
                className={`bg-light transition-all duration-300 overflow-hidden ${
                  activeDropdown === link.title
                    ? "max-h-[500px] py-2"
                    : "max-h-0"
                }`}>
                {subCategories[link.title]?.map((sublink) => (
                  <Link
                    key={sublink.id}
                    to={`/collections/${link.title}/${sublink.name}`}
                    onClick={() => {
                      setActiveDropdown(null);
                      setShowDrawer(false);
                    }}
                    className="block not-last:border-[#EAEAEA] not-last:border-b">
                    <li className="py-3 px-14 text-base hover:underline hover:text-[#39523f]">
                      {sublink.name}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          ))}
        </ul>
      </div>

      {/* Navbar */}
      <div className="wrapper flex-between shadow-md h-[60px] sticky top-0 bg-light z-10 py-2">
        {isAdmin ? (
          <nav className="w-full flex-between">
            <div className="flex items-center gap-6 font-medium text-lg">
              <Link to="/dashboard" className=" hover:text-[#39523f]">
                Dashboard
              </Link>
              <Link to="/products" className=" hover:text-[#39523f]">
                Products
              </Link>
              <Link to="/categories" className=" hover:text-[#39523f]">
                Manage Categories
              </Link>
              <Link to="/admin/orders" className=" hover:text-[#39523f]">
                Manage Orders
              </Link>
            </div>
            <IoIosLogOut
              size={24}
              className="hover:text-[#39523f] cursor-pointer"
              onClick={handleLogOut}
            />
          </nav>
        ) : (
          <div className="relative w-full flex-between">
            {/* Desktop Nav */}
            <nav className="lg:w-1/3 hidden lg:block">
              <ul className="flex items-center justify-start gap-10 uppercase font-semibold text-sm">
                {navLinks.map((link) => (
                  <div key={link.id} className="relative">
                    <li
                      onClick={() => handleSubMenu(link.title)}
                      className="hover:underline hover:text-[#39523f] cursor-pointer">
                      {link.title}
                    </li>
                    <ul
                      className={`absolute bg-light shadow-md shadow-gray-300 rounded-xs w-[300px] px-2 py-2 top-10 ${
                        activeDropdown === link.title ? "block" : "hidden"
                      }`}>
                      {subCategories[link.title]?.map((sublink) => (
                        <Link
                          key={sublink.id}
                          to={`/collections/${link.title}/${sublink.name}`}
                          onClick={() => setActiveDropdown(null)}
                          className="block border-[#EAEAEA] not-last-of-type:border-b-[1px]">
                          <li className="hover:underline hover:text-[#39523f] py-4 ">
                            {sublink.name}
                          </li>
                        </Link>
                      ))}
                    </ul>
                  </div>
                ))}
              </ul>
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden w-1/3">
              {showDrawer ? (
                <IoMdClose
                  size={30}
                  className="hover:text-[#39523f] cursor-pointer"
                  onClick={() => setShowDrawer(false)}
                />
              ) : (
                <IoIosMenu
                  size={30}
                  className="hover:text-[#39523f] cursor-pointer"
                  onClick={() => setShowDrawer(true)}
                />
              )}
            </div>

            {/* Logo Centered */}
            <div className="justify-self-center text-center">
              <Logo />
            </div>

            {/* Right Icons */}
            <div className="w-1/3 flex items-center justify-end gap-6 uppercase font-semibold text-sm">
              <Link to="">
                <FiSearch size={24} className="hover:text-[#39523f]" />
              </Link>
              <div className="relative">
                <Link to="/cart">
                  <FiShoppingCart
                    size={24}
                    className="hover:text-[#39523f] z-10"
                  />
                </Link>
                <span className="w-5 h-5 rounded-full bg-black absolute -top-3 -right-3 -z-10 text-light flex-center text-sm font-medium">
                  {cartCount}
                </span>
              </div>
              <Link to={isAuthenticated ? "/profile" : "/login"}>
                <FiUser size={24} className="hover:text-[#39523f]" />
              </Link>

              {isAuthenticated && (
                <IoIosLogOut
                  size={24}
                  className="hover:text-[#39523f] cursor-pointer"
                  onClick={handleLogOut}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
