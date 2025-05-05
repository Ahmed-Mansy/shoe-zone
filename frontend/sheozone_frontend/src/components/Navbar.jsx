import { Link, useNavigate } from "react-router-dom"; // Fixed import
import Logo from "./Logo";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { IoIosMenu, IoMdClose, IoIosLogOut } from "react-icons/io";
import { IoChevronDownOutline } from "react-icons/io5";
import { useEffect, useState, useRef } from "react"; // Added useRef import
import { getSubCategories } from "../api";
import { useCart } from "../context/CartContext";
import { toast, ToastContainer } from "react-toastify"; // Added ToastContainer
import "react-toastify/dist/ReactToastify.css";

const navLinks = [
  { id: 1, title: "men" },
  { id: 2, title: "women" },
];

const SearchForm = ({ searchTerm, setSearchTerm, handleSearch }) => (
  <form onSubmit={handleSearch} className="relative w-full max-w-xs mx-auto">
    <label htmlFor="search" className="sr-only">
      Search products
    </label>
    <input
      id="search"
      type="text"
      placeholder="Search ..."
      className="w-full border border-gray-300 rounded-full py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#39523f] transition-all duration-200 pl-4 pr-10" // Replaced custom-padding
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <button
      type="submit"
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#39523f]"
      aria-label="Submit search"
    >
      <FiSearch size={18} />
    </button>
  </form>
);

const Navbar = () => {
  const [subCategories, setSubCategories] = useState({});
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null); // Kept for potential future use (e.g., click outside)

  const { cartCount, fetchCartItems } = useCart();
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem("userRole") === "admin"; // Consider server-side validation
  const isAuthenticated = !!localStorage.getItem("userId");

  useEffect(() => {
    fetchCartItems();

    const fetchAllSubCategories = async () => {
      try {
        const allSubCats = {};
        await Promise.all(
          navLinks.map(async (link) => {
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
    // Handle clicks outside dropdown to close it
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
    toast.success("Logged out successfully", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });
    navigate("/");
  };

  const handleSubMenu = (title) => {
    setActiveDropdown((prev) => (prev === title ? null : title));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search-results?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm(""); // Clear search after submission
    }
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
      <ToastContainer /> {/* Added ToastContainer */}
      {/* Drawer */}
      <div
        className={`${
          showDrawer ? "block" : "hidden"
        } w-screen h-full absolute top-[60px] left-0 bg-light border-t-[1px] border-[#E5E5E5] shadow-lg z-20 lg:hidden`}
        aria-hidden={!showDrawer}
      >
        <ul className="flex flex-col uppercase font-semibold text-xl divide-y-[1px] divide-[#EAEAEA] border-b-[1px] border-[#EAEAEA]">
          {navLinks.map((link) => (
            <div key={link.id} className="relative">
              <li
                onClick={() => handleSubMenu(link.title)}
                className="py-4 px-10 hover:underline hover:text-[#39523f] flex justify-between items-center cursor-pointer"
                aria-expanded={activeDropdown === link.title}
                aria-controls={`submenu-${link.title}`}
              >
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
                  activeDropdown === link.title ? "max-h-[500px] py-2" : "max-h-0"
                }`}
              >
                {subCategories[link.title]?.map((sublink) => (
                  <Link
                    key={sublink.id}
                    to={`/collections/${link.title}/${sublink.name}`}
                    onClick={() => {
                      setActiveDropdown(null);
                      setShowDrawer(false);
                    }}
                    className="block not-last:border-[#EAEAEA] not-last:border-b"
                  >
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
              <Link to="/dashboard" className="hover:text-[#39523f]">
                Dashboard
              </Link>
              <Link to="/products" className="hover:text-[#39523f]">
                Products
              </Link>
              <Link to="/categories" className="hover:text-[#39523f]">
                Manage Categories
              </Link>
              <Link to="/admin/orders" className="hover:text-[#39523f]">
                Manage Orders
              </Link>
            </div>
            <div className="justify-self-center text-center">
              <Logo />
            </div>
            <div className="w-1/3 flex items-center justify-end gap-6 uppercase font-semibold text-sm">
              <SearchForm
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
              />
              <IoIosLogOut
                size={24}
                className="hover:text-[#39523f] cursor-pointer"
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
                {navLinks.map((link) => (
                  <div key={link.id} className="relative">
                    <li
                      onClick={() => handleSubMenu(link.title)}
                      className="hover:underline hover:text-[#39523f] cursor-pointer"
                      aria-expanded={activeDropdown === link.title}
                      aria-controls={`desktop-submenu-${link.title}`}
                    >
                      {link.title}
                    </li>
                    <ul
                      id={`desktop-submenu-${link.title}`}
                      className={`absolute bg-light shadow-md shadow-gray-300 rounded-xs w-[300px] px-2 py-2 top-10 ${
                        activeDropdown === link.title ? "block" : "hidden"
                      }`}
                    >
                      {subCategories[link.title]?.map((sublink) => (
                        <Link
                          key={sublink.id}
                          to={`/collections/${link.title}/${sublink.name}`}
                          onClick={() => setActiveDropdown(null)}
                          className="block border-[#EAEAEA] not-last-of-type:border-b-[1px]"
                        >
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
            <div className="w-1/3 flex items-center justify-end gap-6 uppercase font-semibold text-sm">
              <SearchForm
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
              />
              <div className="relative">
                <Link
                  to={isAuthenticated ? "/cart" : "#"}
                  onClick={!isAuthenticated ? handleAuthRedirect : undefined}
                  aria-label="Shopping cart"
                >
                  <FiShoppingCart
                    size={24}
                    className={`hover:text-[#39523f] z-10 ${
                      !isAuthenticated ? "opacity-50" : ""
                    }`}
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
                aria-label={isAuthenticated ? "User profile" : "Log in"}
              >
                <FiUser
                  size={24}
                  className={`hover:text-[#39523f] ${
                    !isAuthenticated ? "opacity-50" : ""
                  }`}
                />
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