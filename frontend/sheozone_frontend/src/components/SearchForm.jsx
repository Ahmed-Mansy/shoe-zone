import { FiSearch } from "react-icons/fi";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router";

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search-results?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm(""); // Clear search after submission
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xs">
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
        aria-label="Submit search">
        <FiSearch size={18} />
      </button>
    </form>
  );
};

SearchForm.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default SearchForm;
