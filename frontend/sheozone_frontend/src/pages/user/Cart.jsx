import { Link, useNavigate } from "react-router";
import CartItem from "../../components/CartItem";

const cartItems = [
  {
    id: "w001",
    price: 139.99,
    title: "Lightweight Sneakers",
    color: "yellow",
    sizes: 41,
    productImage: "../assets/images/3.jpg",
    quantity: 1,
  },
  {
    id: "w002",
    badge: "best",
    price: 159.99,
    title: "Classic Heels",
    color: "black",
    sizes: 38,
    productImage: "../assets/images/1.jpg",
    quantity: 2,
  },
  {
    id: "w003",
    badge: "ReadableByteStreamController",
    price: 119.99,
    title: "Ballet Flats",
    color: "red",
    sizes: 35,
    productImage: "../assets/images/2.jpg",
    quantity: 4,
  },
];

const Cart = () => {
  const navigate = useNavigate();

  return (
    <div className="wrapper">
      {cartItems.length > 0 ? (
        <div className="my-12">
          <h2 className="text-4xl font-semibold">Cart</h2>
          <div className="flex flex-col lg:flex-row justify-between items-start mt-10 divide-y-[1px]  lg:divide-x-[1px] divide-[#EAEAEA]">
            <div className="w-full lg:w-2/3 divide-y-[1px] divide-[#EAEAEA]">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <div className="w-1/2 self-end lg:self-auto lg:w-1/3 px-6 py-8 space-y-8">
              <div className="text-xl font-semibold flex-between px-2">
                <h4>Subtotal:</h4>
                <h4>500 EGP</h4>
              </div>
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="bg-[#212121] text-light w-full py-4 uppercase font-medium text-lg tracking-wider rounded-xs cursor-pointer border-[3px] hover:bg-gray-600">
                proceed to checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="my-56 flex flex-col items-center gap-8">
          <h2 className="text-3xl font-medium">
            There is no items in your cart.
          </h2>
          <Link
            to="/collections/men"
            className="text-blue-600 hover:underline hover:text-blue-500">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
