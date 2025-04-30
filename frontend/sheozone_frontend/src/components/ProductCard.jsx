import PropTypes from "prop-types";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const ProductCard = ({ product, onDelete }) => {
  const [showMore, setShowMore] = useState(false);

  const isAdmin = localStorage.getItem("userRole") === "admin";

  const { name, price, discount_price, images, id } = product;
  const navigate = useNavigate();

  const finalPrice = discount_price || price;

  return (
    <div
      onMouseEnter={() => setShowMore(true)}
      onMouseLeave={() => setShowMore(false)}
      className="w-[calc(33%-12px)] relative space-y-2 cursor-pointer">
      <Link to={`/products/${name}`} state={{ product }}>
        <div className="w-full aspect-square bg-[#f5f5f5]">
          <img src={`${images}`} alt={`${name}`} className="" />
        </div>
      </Link>

      <h3 className="text-md font-semibold">{name}</h3>

      <span className="text-gray-700 inline-block">
        {finalPrice}
        {discount_price && <span className="discounted">{price}</span>} EGP
      </span>

      <div className="flex-start gap-1">
        {product.colors.map((color, index) => {
          return (
            <span
              key={index}
              className={`inline-block w-[25px] h-[25px] rounded-full border border-gray-900 bg-[${color}]`}></span>
          );
        })}
      </div>

      {isAdmin && (
        <>
          <button
            onClick={() => navigate(`/products/edit/${product.id}`)}
            className="btn btn-secondary mx-2">
            Edit
          </button>
          <button onClick={() => onDelete(id)} className="btn btn-danger">
            Delete
          </button>
        </>
      )}

      <div
        className={`w-[calc(100%+60px)] h-[150%] bg-white shadow-lg shadow-gray-900 absolute -z-10 -top-[25px] -left-[25px] ${
          showMore ? "visible" : "hidden"
        }`}></div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProductCard;
