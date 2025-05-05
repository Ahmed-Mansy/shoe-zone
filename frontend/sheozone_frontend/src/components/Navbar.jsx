import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { FiUser, FiShoppingCart } from "react-icons/fi";
import { IoIosMenu, IoMdClose, IoIosLogOut } from "react-icons/io";
import { IoChevronDownOutline } from "react-icons/io5";
import { useEffect, useState, useRef } from "react";
import { getSubCategories } from "../api";
import { useCart } from "../context/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchForm from "./SearchForm";

const userNavLinks = [
  { id: 1, title: "men" },
  { id: 2, title: "women" },
];

const adminNavLinks = [
  { id: 1, title: "Dashboard", to: "/dashboard" },
  { id: 2, title: "Products", to: "/products" },
  { id: 3, title: "Categories", to: "/categories" },
  { id: 4, title: "Orders", to: "/admin/orders" },
];

const Navbar = () => {
  const [subCategories, setSubCategories] = useState({});
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const { cartCount, fetchCartItems } = useCart();
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem("userRole") === "admin";
  const isAuthenticated = !!localStorage.getItem("userId");

  useEffect(() => {
    fetchCartItems();
    const fetchAllSubCategories = async () => {
      try {
        const allSubCats = {};
        await Promise.all(
          userNavLinks.map(async (link) => {
            const result = await getSubCategories(link.title);
            allSubCats[link.title] = result;
          })
        );
        setSubCategories(allSubCats);
      } catch (error) {
        toast.error("Failed to load subcategories", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
      }
    };
    fetchAllSubCategories();
  }, [fetchCartItems]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSubMenu = (title) => {
    setActiveDropdown((prev) => (prev === title ? null : title));
  };

  const handleAuthRedirect = () => {
    toast.warning("Please log in to access this feature", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
    });
    navigate("/login");
  };

  return (
    <>
      {/* <ToastContainer /> */}

      {/* Drawer for user and admin */}
      {isAdmin ? (
        <div
          className={`${
            showDrawer ? "block" : "hidden"
          } w-screen h-full absolute top-[60px] left-0 bg-light border-t-[1px] border-[#E5E5E5] shadow-lg z-20 lg:hidden`}>
          <ul className="flex flex-col font-semibold text-lg divide-y-[1px] divide-[#EAEAEA] border-[#EAEAEA] ">
            {adminNavLinks.map((link) => (
              <li key={link.id} className="py-4 px-8">
                <Link
                  to={link.to}
                  onClick={() => setShowDrawer(false)}
                  className="hover:text-[#39523f]">
                  {link.title}
                </Link>
              </li>
            ))}
            <li
              onClick={handleLogOut}
              className="py-4 px-8 cursor-pointer hover:text-[#39523f]">
              Log out
            </li>
          </ul>
        </div>
      ) : (
        <div
          className={`${
            showDrawer ? "block" : "hidden"
          } w-screen h-full absolute top-[60px] left-0 bg-light border-t-[1px] border-[#E5E5E5] shadow-lg z-20 lg:hidden`}
          aria-hidden={!showDrawer}>
          <ul className="flex flex-col uppercase font-semibold text-xl divide-y-[1px] divide-[#EAEAEA] border-b-[1px] border-[#EAEAEA]">
            {userNavLinks.map((link) => (
              <div key={link.id} className="relative">
                <li
                  onClick={() => handleSubMenu(link.title)}
                  className="py-4 px-10 hover:underline hover:text-[#39523f] flex justify-between items-center cursor-pointer"
                  aria-expanded={activeDropdown === link.title}
                  aria-controls={`submenu-${link.title}`}>
                  {link.title}
                  <IoChevronDownOutline
                    size={20}
                    className={`transition-transform duration-300 ${
                      activeDropdown === link.title ? "rotate-180" : ""
                    }`}
                  />
                </li>
                <ul
                  id={`submenu-${link.title}`}
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
      )}

      {/* Navbar */}
      <div className="wrapper flex-between shadow-md h-[60px] sticky top-0 bg-light z-10 py-2">
        {isAdmin ? (
          <nav className="w-full flex-between">
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden w-1/3">
              {showDrawer ? (
                <IoMdClose
                  size={30}
                  className="hover:text-[#39523f] cursor-pointer"
                  onClick={() => setShowDrawer(false)}
                  aria-label="Close menu"
                />
              ) : (
                <IoIosMenu
                  size={30}
                  className="hover:text-[#39523f] cursor-pointer"
                  onClick={() => setShowDrawer(true)}
                  aria-label="Open menu"
                />
              )}
            </div>

            {/* Admin links (Desktop Only) */}
            <div className="hidden lg:flex items-center gap-4 font-medium text-md">
              {adminNavLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.to}
                  className="hover:text-[#39523f]">
                  {link.title}
                </Link>
              ))}
            </div>

            <div className="justify-self-center text-center">
              <Logo />
            </div>

            <div className="w-1/3 flex items-center justify-end gap-4">
              <SearchForm />
              <IoIosLogOut
                size={24}
                className="hover:text-[#39523f] cursor-pointer hidden lg:block"
                onClick={handleLogOut}
                aria-label="Log out"
              />
            </div>
          </nav>
        ) : (
          <div className="relative w-full flex-between" ref={dropdownRef}>
            {/* Desktop Nav */}
            <nav className="lg:w-1/3 hidden lg:block">
              <ul className="flex items-center justify-start gap-10 uppercase font-semibold text-sm">
                {userNavLinks.map((link) => (
                  <div key={link.id} className="relative">
                    <li
                      onClick={() => handleSubMenu(link.title)}
                      className="hover:underline hover:text-[#39523f] cursor-pointer"
                      aria-expanded={activeDropdown === link.title}
                      aria-controls={`desktop-submenu-${link.title}`}>
                      {link.title}
                    </li>
                    <ul
                      id={`desktop-submenu-${link.title}`}
                      className={`absolute bg-light shadow-md shadow-gray-300 rounded-xs w-[300px] px-2 py-2 top-10 ${
                        activeDropdown === link.title ? "block" : "hidden"
                      }`}>
                      {subCategories[link.title]?.map((sublink) => (
                        <Link
                          key={sublink.id}
                          to={`/collections/${link.title}/${sublink.name}`}
                          onClick={() => setActiveDropdown(null)}
                          className="block border-[#EAEAEA] not-last-of-type:border-b-[1px]">
                          <li className="hover:underline hover:text-[#39523f] py-4">
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
                  aria-label="Close menu"
                />
              ) : (
                <IoIosMenu
                  size={30}
                  className="hover:text-[#39523f] cursor-pointer"
                  onClick={() => setShowDrawer(true)}
                  aria-label="Open menu"
                />
              )}
            </div>

            {/* Logo Centered */}
            <div className="justify-self-center text-center">
              <Logo />
            </div>

            {/* Right Icons */}
            <div className="w-1/3 flex items-center justify-end gap-6">
              <SearchForm />
              <div className="relative">
                <Link
                  to={"/cart"}
                  onClick={!isAuthenticated ? handleAuthRedirect : undefined}
                  aria-label="Shopping cart">
                  <FiShoppingCart
                    size={24}
                    className={`hover:text-[#39523f] z-10 `}
                  />
                </Link>
                {isAuthenticated && cartCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-black absolute -top-3 -right-3 -z-10 text-light flex-center text-sm font-medium">
                    {cartCount}
                  </span>
                )}
              </div>
              <Link
                to={isAuthenticated ? "/profile" : "/login"}
                onClick={!isAuthenticated ? handleAuthRedirect : undefined}
                aria-label={isAuthenticated ? "User profile" : "Log in"}>
                <FiUser size={24} className={`hover:text-[#39523f]`} />
              </Link>
              {isAuthenticated && (
                <IoIosLogOut
                  size={24}
                  className="hover:text-[#39523f] cursor-pointer"
                  onClick={handleLogOut}
                  aria-label="Log out"
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
