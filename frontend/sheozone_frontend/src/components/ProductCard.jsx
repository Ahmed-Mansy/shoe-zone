import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router";

const ProductCard = ({ product }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div
      onMouseEnter={() => setShowMore(true)}
      onMouseLeave={() => setShowMore(false)}
      className="w-[calc(33%-12px)] relative space-y-2 cursor-pointer">
      <Link to={`/products/${product.title}`} state={{ product }}>
        <div className="w-full aspect-square bg-[#f5f5f5]">
          <img
            src={`${product.productImage}`}
            alt={`${product.title}`}
            className=""
          />
        </div>

        <h3 className="text-md font-semibold">{product.title}</h3>

        <span className="text-gray-700 inline-block">{product.price} EGP</span>

        <div className="flex-start gap-1">
          {product.colors.map((color, index) => {
            return (
              <span
                key={index}
                className={`inline-block w-[25px] h-[25px] rounded-full border border-gray-900 bg-[${color}]`}></span>
            );
          })}
        </div>

        <div
          className={`w-[calc(100%+60px)] h-[150%] bg-white shadow-lg shadow-gray-900 absolute -z-10 -top-[25px] -left-[25px] ${
            showMore ? "visible" : "hidden"
          }`}></div>
      </Link>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductCard;
