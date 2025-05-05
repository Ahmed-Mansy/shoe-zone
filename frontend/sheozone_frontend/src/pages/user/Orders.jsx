import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your orders.");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}orders/my-orders/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Your session has expired. Please log in again.");
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch orders.");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="wrapper my-8 flex justify-center items-center h-screen">
        <svg className="animate-spin h-8 w-8 text-dark" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      </div>
    );
  }

  if (error) {
    return <div className="wrapper my-8 text-red-600">{error}</div>;
  }

  return (
    <div className="wrapper my-8">
      <h2 className="text-2xl font-medium mb-6">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="text-gray-600">
          <p>You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 bg-dark text-light py-2 px-4 rounded-xs hover:bg-gray-600"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Order #{order.id} - {new Date(order.created_at).toLocaleDateString()}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "shipped"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                <strong>Shipping Address:</strong> {order.shipping_address}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Payment Method:</strong>{" "}
                {order.payment_status === "cod" ? "Cash on Delivery" : "Stripe"}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Total:</strong> EGP {order.total_price}
              </p>
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold mb-2">Items:</h4>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>
                        {item.quantity} x {item.product_name} #{item.product_id}
                      </span>
                      <span>EGP {(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;