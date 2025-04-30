import { Link, useNavigate } from "react-router";

const cartItems = [
  {
    id: "w001",
    price: 139.99,
    title: "Lightweight Sneakers",
    color: "yellow",
    sizes: 41,
    productImage: "../assets/images/3.jpg",
  },
  {
    id: "w002",
    badge: "best",
    price: 159.99,
    title: "Classic Heels",
    color: "black",
    sizes: 38,
    productImage: "../assets/images/1.jpg",
  },
  {
    id: "w003",
    badge: "ReadableByteStreamController",
    price: 119.99,
    title: "Ballet Flats",
    color: "red",
    sizes: 35,
    productImage: "../assets/images/2.jpg",
  },
];

const Cart = () => {
  const navigate = useNavigate();
  const handleQuantity = (e) => {
    console.log(e.target.value);
  };

  return (
    <div className="wrapper">
      {cartItems.length > 0 ? (
        <div className="my-12">
          <h2 className="text-4xl font-semibold">Cart</h2>
          <div className="flex justify-between items-start mt-10 divide-x-[1px] divide-[#EAEAEA]">
            <div className="w-2/3 divide-y-[1px] divide-[#EAEAEA]">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 flex gap-3">
                  <div className="w-[150px] aspect-auto bg-light-gray">
                    <img
                      src={item.productImage}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="py-4 px-2 flex-between w-[calc(100%-200px)]">
                    <div className="flex flex-col items-start gap-4">
                      <h2 className="font-semibold text-lg">{item.title}</h2>

                      <p>{item.price}</p>

                      <button
                        type="button"
                        className="block text-red-700 font-light cursor-pointer hover:text-red-600">
                        Remove
                      </button>
                    </div>

                    <div className="flex-center gap-2">
                      <h3>Quantity: </h3>
                      <select
                        name="quantity"
                        className="w-[50px] text-center"
                        onChange={handleQuantity}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}{" "}
            </div>
            <div className="w-1/3 px-6 py-8 space-y-8">
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
