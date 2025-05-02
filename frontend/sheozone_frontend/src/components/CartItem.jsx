import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";

const CartItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantity = (e) => {
    const operand = e.target.innerHTML;
    if (operand === "+") {
      setQuantity((prev) => prev + 1);
    } else if (operand === "-" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleRemoveItem = (id) => {
    console.log(id);
  };

  return (
    <div key={item.id} className="p-4 flex gap-3">
      <div className="w-[150px] aspect-auto bg-light-gray">
        <Link to={`/products/${item.id}`}>
          <img
            src={item.productImage}
            alt={item.title}
            className="w-full h-full object-contain"
          />
        </Link>
      </div>

      <div className="py-4 px-2 flex-between w-[calc(100%-200px)]">
        <div className="flex flex-col items-start gap-4">
          <h2 className="font-semibold text-lg">{item.title}</h2>

          <p>{item.price}</p>

          <button
            type="button"
            onClick={() => handleRemoveItem(item.id)}
            className="block text-red-700 font-light cursor-pointer hover:text-red-600">
            Remove
          </button>
        </div>

        <div className="flex flex-col items-center gap-10">
          <div>
            <div className="w-[90px] flex-center">
              <span
                onClick={handleQuantity}
                className="w-[30px] h-[30px] flex-center cursor-pointer">
                +
              </span>
              <span className="w-[30px] h-[30px] flex-center border-[1px] border-gray-300 rounded-xs text-sm">
                {quantity}
              </span>
              <span
                onClick={handleQuantity}
                className="w-[30px] h-[30px] flex-center cursor-pointer">
                -
              </span>
            </div>
          </div>
          <div>
            <h3>
              Total : <span>{(quantity * item.price).toFixed(2)}</span> EGP
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default CartItem;
