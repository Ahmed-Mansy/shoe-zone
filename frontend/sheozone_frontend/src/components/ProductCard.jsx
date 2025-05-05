import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FaStar, FaRegStar } from "react-icons/fa";
import ImagesSlider from "./ImagesSlider";
import { toast } from "react-toastify"; // Added toast import
import "react-toastify/dist/ReactToastify.css"; // Ensure toast styles are included

const ProductCard = ({ product, onDelete, onEdit }) => {
  const isAdmin = localStorage.getItem("userRole") === "admin"; // Consider server-side validation
  const isAuthenticated = !!localStorage.getItem("userId"); // Align with Navbar

  const {
    name,
    price,
    discount_price,
    images,
    id,
    available_colors,
    average_rating,
    stock_quantity,
  } = product;
  const finalPrice = discount_price || price;

  return (
    <div className="w-full mx-2 my-4 border border-gray-300 rounded-md p-4 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out">
      <Link
        to={
          isAuthenticated
            ? isAdmin
              ? `/admin/products/${id}`
              : `/products/${id}`
            : "/login"
        }
        state={product}
        onClick={() => {
          if (!isAuthenticated) {
            toast.warning("Unauthorized: Please login", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 3000,
            });
          }
        }}
        aria-label={`View details for ${name}`}>
        <div className="w-full aspect-square bg-[#f5f5f5] rounded-md overflow-hidden">
          {images.length > 0 ? (
            <ImagesSlider images={images} />
          ) : (
            <img
              src="/placeholder.jpg"
              alt={name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </Link>

      <div className="space-y-3 mt-2">
        <h3 className="text-md font-semibold capitalize text-center">{name}</h3>

        {/* Rating Section (Uncommented and Fixed) */}
        <div
          className="flex items-center justify-center gap-1 text-yellow-500"
          aria-label={`Rating: ${average_rating} out of 5`}>
          {Array.from({ length: 5 }, (_, index) =>
            index < Math.round(average_rating) ? (
              <FaStar key={index} />
            ) : (
              <FaRegStar key={index} />
            )
          )}
        </div>

        <div className="flex justify-center gap-1">
          {available_colors.map((color, index) => (
            <span
              key={index}
              style={{ backgroundColor: color }}
              className="inline-block w-[25px] h-[25px] rounded-full border border-gray-900"
              aria-label={`Color: ${color}`}></span>
          ))}
        </div>

        <div className="text-md flex justify-center items-center space-x-3">
          {discount_price !== 0 && (
            <span
              className="bg-red-500 text-white text-xs px-2 py-1 rounded"
              aria-label="On sale">
              Sale
            </span>
          )}
          <span className="sm-semibold">{finalPrice} EGP</span>
          {discount_price && (
            <span className="text-gray-600 line-through">{price} EGP</span>
          )}
        </div>

        {stock_quantity <= 0 ? (
          <span
            className="block text-center text-sm text-red-600 font-bold"
            aria-label="Out of stock">
            Out of Stock
          </span>
        ) : stock_quantity <= 5 ? (
          <span
            className="block text-center text-sm text-orange-600 font-bold"
            aria-label={`Low stock: ${stock_quantity} left`}>
            Only {stock_quantity} left!
          </span>
        ) : null}

        {isAdmin && (
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => onEdit(id)}
              className="bg-gray-500 text-white w-[80px] text-center cursor-pointer rounded-xs px-3 py-2 hover:bg-gray-600 transition"
              aria-label={`Edit product ${name}`}>
              Edit
            </button>
            <button
              onClick={() => onDelete(id)}
              className="bg-red-600 text-white w-[80px] text-center cursor-pointer rounded-xs px-3 py-2 hover:bg-red-700 transition"
              aria-label={`Delete product ${name}`}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discount_price: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    available_colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    average_rating: PropTypes.number.isRequired,
    stock_quantity: PropTypes.number.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ProductCard;
