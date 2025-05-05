import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";

const available_sizes = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
const available_colors = [
  "black",
  "white",
  "gray",
  "brown",
  "blue",
  "red",
  "yellow",
  "green",
];

const Filters = ({
  collectionTitle,
  setProducts,
  type,
  categoryId,
  searchTerm = "",
}) => {
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const isReadyToFilter = selectedColors.length > 0 || selectedSizes.length > 0;

  const handleSizeSelection = (size) => {
    setSelectedSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((selectedSize) => selectedSize !== size)
        : [...prevSizes, size]
    );
  };

  const handleColorSelection = (color) => {
    setSelectedColors((prevColors) =>
      prevColors.includes(color)
        ? prevColors.filter((selectedColor) => selectedColor !== color)
        : [...prevColors, color]
    );
  };

  const handleFilterItems = async () => {
    const searchParams = searchTerm ? `search=${searchTerm}` : "";
    const sizeParams =
      selectedSizes.length > 0 ? `&size=${selectedSizes.join(",")}` : "";
    const colorParams =
      selectedColors.length > 0 ? `&color=${selectedColors.join(",")}` : "";
    const typeParams = type ? `type=${type}` : "";
    const categoryParams = categoryId ? `&category=${categoryId}` : "";

    const queryString = `?${searchParams}${typeParams}${categoryParams}${sizeParams}${colorParams}`;

    const url = `http://127.0.0.1:8000/api/products/api/products/${queryString}`;
    console.log("URL ==> ", url);

    try {
      const response = await axios.get(url);
      console.log("Filtered Products:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-medium uppercase">{collectionTitle}</h2>
      <div className="mt-8 divide-y-[1px] divide-[#EAEAEA] border-b-[1px] border-[#EAEAEA] pb-4">
        <h2 className="text-lg font-medium pb-4">Filter By :</h2>

        {/* Size Filter */}
        <div className="space-y-4 py-4">
          <h2 className="text-md font-medium">Sizes</h2>
          <p className="text-xs">
            Most of our shoes only come in full sizes. If you’re a half size,
            select your nearest whole size too.
          </p>
          <div className="flex gap-2 flex-wrap">
            {available_sizes.map((size, index) => (
              <span
                key={index}
                onClick={() => handleSizeSelection(size)}
                className={`block w-[40px] h-[40px] rounded-xs text-[#212121] border-[1px] border-[#212121] flex-center cursor-pointer hover:bg-gray-400 transition-all duration-300 ${
                  selectedSizes.includes(size) ? "bg-dark text-light" : ""
                }`}>
                {size}
              </span>
            ))}
          </div>
        </div>

        {/* Color Filter */}
        <div className="space-y-4 py-4">
          <h2 className="text-md font-medium">Colors</h2>
          <ul className="space-y-3">
            {available_colors.map((color, index) => (
              <li
                key={index}
                onClick={() => handleColorSelection(color)}
                className="cursor-pointer flex items-center gap-4 capitalize text-md">
                <span
                  style={{ backgroundColor: color }}
                  className={`block w-[30px] h-[30px] rounded-full border-[1px] border-gray-400 ${
                    selectedColors.includes(color)
                      ? "ring-[2px] ring-gray-400 ring-offset-2 border-transparent"
                      : ""
                  }`}></span>
                <span>{color}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          className={`w-full py-2 text-white uppercase font-medium text-lg tracking-wider rounded-xs transition-colors duration-300 ${
            isReadyToFilter
              ? "cursor-pointer bg-[#212121] hover:opacity-90"
              : "cursor-not-allowed bg-gray-400"
          }`}
          disabled={!isReadyToFilter}
          onClick={handleFilterItems}>
          Filter Items
        </button>
      </div>
    </div>
  );
};

Filters.propTypes = {
  collectionTitle: PropTypes.string.isRequired,
  setProducts: PropTypes.func.isRequired,
  type: PropTypes.string,
  categoryId: PropTypes.number,
  searchTerm: PropTypes.string,
};

export default Filters;
