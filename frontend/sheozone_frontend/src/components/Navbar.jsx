import { Link } from "react-router";
import Logo from "./Logo";
import { FiSearch, FiUser, FiHelpCircle, FiShoppingCart } from "react-icons/fi";

const NavBar = () => {
  return (
    <div className="wrapper flex-between shadow-md h-[60px] sticky top-0 bg-light z-10 py-2">
      <nav>
        <ul className="flex-between gap-6 uppercase font-semibold text-sm">
          <li className="cursor-pointer hover:underline">men</li>
          <li className="cursor-pointer hover:underline">women</li>
          <li className="cursor-pointer hover:underline">socks</li>
          <li className="cursor-pointer hover:underline">new arrivals</li>
        </ul>
      </nav>
      <Logo />
      <ul className="flex-between gap-6 uppercase font-semibold text-sm">
        <li className="cursor-pointer hover:underline">
          <Link to="/stores">stores</Link>
        </li>
        <li className="cursor-pointer">
          <FiSearch size={24} />
        </li>
        {/* //TODO Route will depends on the user's authentication status */}
        <li className="cursor-pointer">
          <Link to="/profile">
            <FiUser size={24} />
          </Link>
        </li>
        <li className="cursor-pointer">
          <FiHelpCircle size={24} />
        </li>
        <li className="cursor-pointer">
          <Link to="/cart">
            <FiShoppingCart size={24} />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
