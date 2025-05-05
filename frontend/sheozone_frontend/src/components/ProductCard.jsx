import ImagesSlider from "./ImagesSlider";
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
  const isAdmin = localStorage.getItem("userRole") === "admin";

  const {
    name,
    price,
    discount_price,
    images,
    id,
    available_colors,
    average_rating,
    stock_quantity,
    reviews
  } = product;
  const finalPrice = discount_price || price;

  return (
    <div className="w-full relative space-y-3 mx-2 my-4 border border-gray-300 rounded-md p-4 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out">
      <Link
        to={isAdmin ? `/admin/products/${id}` : `/products/${id}`}
        state={product}
      >
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

      <h3 className="text-md font-semibold mt-2 capitalize text-center">
        {name}
      </h3>

      <div className="flex justify-center items-center gap-2 my-2">
        <Rating
          style={{ maxWidth: 100 }}
          value={average_rating || 0}
          itemStyles={myStyles}
          readOnly
        />
        <span className="text-sm text-gray-600">
          {average_rating ? average_rating.toFixed(1) : "No ratings"}
        </span>
      </div>

      <div className="text-xs text-gray-500 text-center">
        {reviews?.length > 0 ? `${reviews.length} Reviews` : "No Reviews Yet"}
        {/* {reviews?.length > 0 ? reviews.length + " Reviews" : "No Reviews Yet"}
        {reviews && reviews.length > 0 ? `${reviews.length} Reviews` : "No Reviews Yet"} */}
      </div>

      {/* Rating Section */}
      {/* <div className="flex items-center gap-1 text-yellow-500">
        {Array.from({ length: 5 }, (_, index) => {
          const rating = Math.round(average_rating); 
          return index < rating ? (
            <FaStar key={index} />
          ) : (
            <FaRegStar key={index} />
          );
        })}
      </div> */}

      <div className="w-full relative space-y-3 mx-2 my-4">
        <h3 className="text-md font-semibold mt-2 capitalize">{name}</h3>

        <div className="flex-start gap-1">
          {available_colors.map((color, index) => (
            <span
              key={index}
              style={{ backgroundColor: color }}
              className="inline-block w-[25px] h-[25px] rounded-full border border-gray-900"
            ></span>
          ))}
        </div>

        <p className="text-md space-x-3">
          {discount_price !== 0 && (
            <span className="top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Sale
            </span>
          )}
          <span className="sm-semibold">{finalPrice} EGP</span>
          {discount_price && (
            <span className="text-gray-600 line-through">{price} EGP</span>
          )}
        </p>

        <span
          className={`mx-4 my-4 ${
            stock_quantity <= 0 ? "text-sm text-red-600 bold" : "hidden"
          }`}
        >
          Out of Stock
        </span>

        {isAdmin && (
          <div className="flex-center gap-2">
            <button
              onClick={() => onEdit(id)}
              className="bg-gray-500 text-white w-[80px] text-center cursor-pointer rounded-xs px-3 py-2 mx-2 hover:bg-gray-600 transition"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(id)}
              className="bg-red-600 text-white w-[80px] text-center cursor-pointer rounded-xs px-3 py-2 hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ProductCard;
