import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Load the Stripe key using a Vite environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({
  formData,
  handleSubmit,
  paymentMethod,
  loading,
  error,
  success,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      handleSubmit(
        e,
        null,
        stripe,
        elements,
        "Please provide a valid email address."
      );
      return;
    }

    const totalAmount = parseFloat(
      formData.items
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2)
    );
    const orderData = {
      shipping_address: `${formData.address}, ${formData.apartment || ""}, ${
        formData.city
      }, ${formData.zipCode}, ${formData.countryName}`,
      payment_status: paymentMethod,
      items: formData.items.map((item) => ({
        product_id: item.product_id, // Use product_id,
        quantity: item.quantity,
      })),
      total_amount: totalAmount,
    };

    await handleSubmit(e, orderData, stripe, elements, null);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {paymentMethod === "stripe" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Details
          </label>
          <div className="p-3 border border-gray-300 rounded-md bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#374151",
                    "::placeholder": { color: "#9ca3af" },
                  },
                  invalid: { color: "#ef4444" },
                },
              }}
            />
          </div>
        </div>
      )}
      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
      )}
      {success && (
        <div className="text-green-600 bg-green-50 p-3 rounded-md">
          {success}
        </div>
      )}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            loading ||
            (!stripe && paymentMethod === "stripe") ||
            formData.items.length === 0
          }
          className={`cursor-pointer bg-dark hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xs disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center`}>
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                viewBox="0 0 24 24">
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
              Processing...
            </span>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </form>
  );
};

CheckoutForm.propTypes = {
  formData: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  paymentMethod: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  success: PropTypes.string,
};

const Checkout = () => {
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    zipCode: "",
    phone: "",
    countryCode: "",
    countryName: "",
    items: [],
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => {
        const countryData = data
          .map((country) => ({
            name: country.name.common,
            code: country.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryData);
      })
      .catch(() => setError("Failed to load countries."));
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartError("Please log in to view your cart.");
        setCartLoading(false);
        navigate("/login");
        return;
      }

      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}cart/view/`;
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          let errorText;
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorText = errorData.message || "Unknown error";
          } else {
            errorText = await response.text();
          }
          console.error("Cart fetch error:", response.status, errorText);
          if (response.status === 401) {
            setCartError("Your session has expired. Please log in again.");
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error(
            `Failed to fetch cart: ${response.status} - ${errorText}`
          );
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Received non-JSON response:", text);
          throw new Error("Received non-JSON response from server");
        }

        const data = await response.json();
        console.log("Cart API response:", data); // Debug log to check API response
        if (data.items && Array.isArray(data.items)) {
          setFormData((prev) => ({
            ...prev,
            items: data.items.map((item) => ({
              id: item.id, // CartItem ID
              product_id: item.product_id, // Use product_id from API
              quantity: item.quantity,
              price: item.product_price,
              product_name: item.product_name || `Product #${item.product_id}`,
              image: item.image || "https://via.placeholder.com/64",
            })),
          }));
        } else {
          setFormData((prev) => ({ ...prev, items: [] }));
        }
      } catch (err) {
        setCartError(
          `Failed to load cart. Please try again. Details: ${err.message}`
        );
      } finally {
        setCartLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      const selectedCountry = countries.find(
        (country) => country.name === value
      );
      setFormData({
        ...formData,
        countryName: value,
        countryCode: selectedCountry ? selectedCountry.code : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const clearCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}cart/clear/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        let data = null;
        if (response.status !== 204) {
          data = await response.json();
        }
        if (data && data.items) {
          const deletePromises = data.items.map((item) =>
            fetch(`${import.meta.env.VITE_API_URL}cart/item/${item.id}/`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          );
          await Promise.all(deletePromises);
        }
      }
    } catch (err) {
      console.error("Failed to clear cart:", err);
      toast.error("Failed to clear cart. Please try again.");
    }
  };

  const handleSubmit = async (e, orderData, stripe, elements, errorMessage) => {
    e.preventDefault();
    setLoading(true);
    setError(errorMessage);
    setSuccess(null);

    if (errorMessage || !orderData) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to place an order.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}orders/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorData;
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
        } else {
          const text = await response.text();
          console.error("Non-JSON response from orders/create:", text);
          throw new Error("Received non-JSON response from server");
        }

        if (response.status === 401) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error(errorData.error || "Failed to create order");
      }

      const { order, message, client_secret, payment_intent_id } =
        await response.json();

      if (orderData.payment_status === "cod") {
        await clearCart();
        setSuccess(message);
        setTimeout(() => navigate("/orders"), 2000);
        return;
      }

      if (orderData.payment_status === "stripe") {
        const result = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              email: formData.email,
              name: `${formData.firstName} ${formData.lastName}`,
              address: {
                line1: formData.address,
                city: formData.city,
                postal_code: formData.zipCode,
                country: formData.countryCode,
              },
            },
          },
        });

        if (result.error) {
          setError(result.error.message);
        } else if (result.paymentIntent.status === "succeeded") {
          const confirmResponse = await fetch(
            `${import.meta.env.VITE_API_URL}orders/confirm-payment/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                payment_intent_id,
                order_id: order.id,
              }),
            }
          );

          if (!confirmResponse.ok) {
            const contentType = confirmResponse.headers.get("content-type");
            let errorData;
            if (contentType && contentType.includes("application/json")) {
              errorData = await confirmResponse.json();
            } else {
              const text = await response.text();
              console.error(
                "Non-JSON response from orders/confirm-payment:",
                text
              );
              throw new Error("Received non-JSON response from server");
            }

            if (confirmResponse.status === 401) {
              setError("Your session has expired. Please log in again.");
              localStorage.removeItem("token");
              navigate("/login");
              return;
            }
            throw new Error(errorData.error || "Failed to confirm payment");
          }

          await clearCart();
          setSuccess("Payment confirmed successfully!");
          setTimeout(() => navigate("/orders"), 2000);
        }
      }
    } catch (err) {
      setError(err.message || " Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
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

  if (cartError) {
    return <div className="wrapper my-8 text-red-600">{cartError}</div>;
  }

  if (formData.items.length === 0) {
    return (
      <div className="wrapper my-8">
        <p className="text-gray-600">Your cart is empty.</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 bg-dark text-light py-2 px-4 rounded-xs hover:bg-gray-600">
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="wrapper my-8">
      <h2 className="text-xl font-medium mb-4">Checkout</h2>

      <div className="mb-8 p-6 bg-white shadow-md rounded-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Order Summary
        </h3>
        <ul className="space-y-4">
          {formData.items.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {item.product_name || `Product #${item.product_id}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                EGP {(item.price * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-800">Total:</p>
          <p className="text-lg font-bold text-green-600">
            EGP{" "}
            {formData.items
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-medium mb-4">Shipping Address</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Apartment, suite, etc. (optional)
        </label>
        <input
          type="text"
          name="apartment"
          value={formData.apartment}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <select
          name="country"
          value={formData.countryName}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          required>
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country.code} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code
          </label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="mb-8 relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone (optional)
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {formData.phone && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/4 text-gray-500">
            <FaQuestionCircle size={16} />
          </span>
        )}
      </div>

      <h2 className="text-xl font-medium mb-4">Payment Method</h2>
      <div className="mb-8">
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
          <option value="cod">Cash on Delivery</option>
          <option value="stripe">Credit/Debit Card (Stripe)</option>
        </select>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm
          formData={formData}
          handleSubmit={handleSubmit}
          paymentMethod={paymentMethod}
          loading={loading}
          error={error}
          success={success}
        />
      </Elements>
    </div>
  );
};

Checkout.propTypes = {
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default Checkout;
