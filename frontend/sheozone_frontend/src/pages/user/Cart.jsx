import { Link, useNavigate } from "react-router-dom";
import CartItem from "../../components/CartItem";
import { useEffect, useState } from "react";
import { getCartItems } from "../../api";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);

  const isAuthenticated = localStorage.getItem("token") ? true : false;

  useEffect(() => {
    const fetchCartItems = async () => {
      const items = await getCartItems();
      setCartItems(items);
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const total =
      cartItems.reduce(
        (acc, item) => acc + item.quantity * item.product_price,
        0
      ) || 0;
    setSubTotal(total.toFixed(2));
  }, [cartItems]);

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      toast.error("You must be logged in to proceed to checkout.");
      navigate("/login");
    }
  };

  return (
    <div className="wrapper">
      {cartItems && cartItems.length > 0 ? (
        <div className="my-12">
          <h2 className="text-4xl font-semibold">Cart</h2>
          <div className="flex flex-col lg:flex-row justify-between items-start mt-10 divide-y-[1px]  lg:divide-x-[1px] divide-[#EAEAEA]">
            <div className="w-full lg:w-2/3 divide-y-[1px] divide-[#EAEAEA]">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  setCartItems={setCartItems}
                  cartItems={cartItems}
                />
              ))}
            </div>
            <div className="w-1/2 self-end lg:self-auto lg:w-1/3 px-6 py-8 space-y-8">
              <div className="text-xl font-semibold flex-between px-2">
                <h4>Subtotal:</h4>
                <h4>{subTotal} EGP</h4>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                className="bg-[#212121] text-light w-full py-4 uppercase font-medium text-lg tracking-wider rounded-xs cursor-pointer border-[3px] hover:bg-gray-600">
                proceed to checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="my-56 flex flex-col items-center gap-8">
          <h2 className="text-3xl font-medium">
            There are no items in your cart.
          </h2>
          <Link
            to="/"
            className="text-blue-600 hover:underline hover:text-blue-500">
            Go Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;