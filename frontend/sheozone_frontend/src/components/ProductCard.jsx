import PropTypes from "prop-types";
import { Link } from "react-router";

const ProductCard = ({ product, onDelete, onEdit }) => {
  const isAdmin = localStorage.getItem("userRole") === "admin";

  const { name, price, discount_price, images, id, available_colors } = product;
  // const navigate = useNavigate();

  const finalPrice = discount_price || price;

  return (
    <div className="w-full relative space-y-3 mx-2  my-4">
      <Link to={`/products/${id}`} state={{ product }}>
        <div className="w-full aspect-square bg-[#f5f5f5]">
        <img
          src={
            images?.length > 0
              ? `${isAdmin ? "" : "http://127.0.0.1:8000/"}${images[0].image}`
              : "/placeholder.jpg"
          }
          alt={name}
          className="w-full h-full"
        />
        </div>
      </Link>

      <h3 className="text-md font-semibold mt-2 capitalize">{name}</h3>

      <div className="flex-start gap-1">
        {available_colors.map((color, index) => {
          return (
            <span
              key={index}
              style={{ backgroundColor: color }}
              className={`inline-block w-[25px] h-[25px] rounded-full border border-gray-900`}></span>
          );
        })}
      </div>

      <p className="text-md space-x-3">
        <span className="sm-semibold">{finalPrice} EGP</span>
        {discount_price && (
          <span className="text-gray-600 line-through">{price} EGP</span>
        )}
      </p>

      {isAdmin && (
        <div className="flex-center gap-2">
          <button
            onClick={() => onEdit(id)}
            className="bg-gray-500 text-white w-[80px] text-center cursor-pointer rounded-xs px-3 py-2 mx-2 hover:bg-gray-600 transition">
            Edit
          </button>

          <button
            onClick={() => onDelete(id)}
            className="bg-red-600 text-white w-[80px] text-center cursor-pointer rounded-xs px-3 py-2 hover:bg-red-700 transition">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ProductCard;
