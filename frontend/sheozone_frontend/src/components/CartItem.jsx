import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import axios from "axios";
import { useCart } from "../context/CartContext";

const CartItem = ({ item, setCartItems, cartItems }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const { fetchCartItems } = useCart();
  //   let newQuantity = quantity;

  //   if (operand === "+") {
  //     newQuantity = quantity + 1;
  //     setQuantity(newQuantity);
  //   } else if (operand === "-" && quantity > 1) {
  //     newQuantity = quantity - 1;
  //     setQuantity(newQuantity);
  //   }
  //   console.log(quantity);
  //   updateQuantity();
  // };

  // const updateQuantity = async () => {
  //   try {
  //     await axios.put(
  //       `http://127.0.0.1:8000/api/cart/item/${item.id}/`,
  //       { quantity: quantity },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         },
  //       }
  //     );

  //     fetchCartItems();
  //   } catch (err) {
  //     console.error("Update error", err);
  //   }
  // };

  const handleQuantity = (e) => {
    const operand = e.target.innerHTML;

    let newQuantity = quantity;

    if (operand === "+") {
      newQuantity = quantity + 1;
    } else if (operand === "-" && quantity > 1) {
      newQuantity = quantity - 1;
    }

    setQuantity(newQuantity);
    updateQuantity(newQuantity);
  };

  const updateQuantity = async (newQuantity) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/cart/item/${item.id}/`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      fetchCartItems();
    } catch (err) {
      console.error("Update error", err);
    }
  };

  const handleRemoveItem = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/cart/item/${item.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setCartItems(cartItems.filter((ci) => ci.id !== item.id));
      fetchCartItems();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div className="p-4 flex gap-3">
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
          <h2 className="font-semibold text-lg uppercase tracking-wider">
            {item.product_name}
          </h2>
          <p className="font-medium text-sm">{item.product_price} EGP</p>
          <button
            type="button"
            onClick={handleRemoveItem}
            className="block text-red-700 font-light cursor-pointer hover:text-red-600">
            Remove
          </button>
        </div>

        <div className="flex flex-col items-center gap-10">
          <div className="w-[90px] flex-center">
            <span
              onClick={handleQuantity}
              className="w-[30px] h-[30px] flex-center cursor-pointer hover:bg-gray-100">
              +
            </span>
            <span className="w-[30px] h-[30px] flex-center border-[1px] border-gray-300 rounded-xs text-sm">
              {quantity}
            </span>
            <span
              onClick={handleQuantity}
              className="w-[30px] h-[30px] flex-center cursor-pointer hover:bg-gray-100">
              -
            </span>
          </div>
          <div>
            <h3>
              Total : <span>{(quantity * item.product_price).toFixed(2)}</span>{" "}
              EGP
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
  setCartItems: PropTypes.func.isRequired,
  cartItems: PropTypes.array.isRequired,
};

export default CartItem;
