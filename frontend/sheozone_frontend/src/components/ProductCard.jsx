import ImagesSlider from "./ImagesSlider";
import { toast } from "react-toastify"; // Added toast import
import "react-toastify/dist/ReactToastify.css"; // Ensure toast styles are included
import { FaStar, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Rating, Star } from "@smastrom/react-rating";

const myStyles = {
  itemShapes: Star,
  itemStrokeWidth: 1,
  activeFillColor: "#212121",
  activeStrokeColor: "#212121",
  inactiveFillColor: "#fff",
  inactiveStrokeColor: "#212121",
};

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
    reviews,
  } = product;

  const finalPrice =
    discount_price > 0 ? price - (discount_price * price) / 100 : price;

  const isValidColor = (color) => {
    const s = new Option().style;
    s.color = color;
    return s.color !== "";
  };

  return (
    <div className="w-full mx-2 my-4 border border-gray-300 rounded-md shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out relative">
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
        <div className="w-full aspect-square bg-[#f5f5f5] rounded-t-md overflow-hidden relative">
          {images.length > 0 ? (
            <ImagesSlider images={images} />
          ) : (
            <img
              src="/placeholder.jpg"
              alt={name}
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute bottom-0 left-0 z-8">
            {discount_price !== 0 && (
              <span
                className="bg-red-500 text-white text-md px-3 py-1 rounded-xs animate-flash-red"
                aria-label="On sale">
                Sale
              </span>
            )}
          </div>

          {stock_quantity <= 0 ? (
            <span
              className="absolute top-2 left-0 z-8 bg-black block text-center text-sm text-white font-medium p-1 "
              aria-label="Out of stock">
              Out of Stock
            </span>
          ) : stock_quantity <= 5 ? (
            <span
              className="absolute top-2 left-0 z-8 bg-black block text-center text-sm text-white font-medium p-1 "
              aria-label={`Low stock: ${stock_quantity} left`}>
              Only {stock_quantity} left!
            </span>
          ) : null}
        </div>
      </Link>

      <div className="space-y-3 pt-2 pb-6 px-4">
        <h3 className="text-md font-semibold capitalize ">{name}</h3>

        <div className="flex items-center gap-2">
          <Rating
            style={{ maxWidth: 100 }}
            value={average_rating || 0}
            itemStyles={myStyles}
            readOnly
          />
          <span className="text-sm text-gray-600">
            {average_rating ? average_rating.toFixed(1) : "0.0"}
          </span>
          <span className="text-sm text-gray-500 text-center">
            ({reviews?.length > 0 ? `${reviews.length}` : 0})
          </span>
        </div>

        <div className="flex gap-1">
          {available_colors.filter(isValidColor).map((color, index) => (
            <span
              key={index}
              style={{ backgroundColor: color }}
              className="inline-block w-[25px] h-[25px] rounded-full border border-gray-900"
              aria-label={`Color: ${color}`}></span>
          ))}
        </div>

        <div className="text-md flex items-center space-x-3">
          <span className=" font-semibold">{finalPrice} EGP</span>
          {discount_price > 0 && (
            <span className="text-gray-600 line-through">{price} EGP</span>
          )}
        </div>

        {isAdmin && (
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => onEdit(id)}
              className="bg-blue-500 text-white w-[80px] text-center cursor-pointer rounded-xs px-3 py-2 hover:bg-blue-600 transition"
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
