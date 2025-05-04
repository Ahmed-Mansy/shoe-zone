import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Input from "../../components/Input";
import { FaQuestionCircle } from "react-icons/fa";

const Checkout = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => {
        const countryNames = data
          .map((country) => country.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(countryNames);
      });
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    zipCode: "",
    phone: "",
    country: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="wrapper my-8">
      <h2 className="text-xl font-medium mb-4">Express checkout</h2>

      <div className="flex gap-2 mb-8">
        <button className="flex-1 cursor-pointer bg-purple-600 text-white py-3 rounded flex items-center justify-center">
          <span className="font-medium">Shop</span>
          <span className="font-bold ml-1">Pay</span>
        </button>
        <button className="flex-1 cursor-pointer bg-yellow-300 text-black py-3 rounded flex items-center justify-center">
          <span className="font-bold">amazon</span>
          <span className="ml-1">pay</span>
        </button>
        <button className="flex-1 cursor-pointer bg-yellow-400 text-blue-800 py-3 rounded flex items-center justify-center">
          <span className="font-bold text-blue-700">Pay</span>
          <span className="font-bold text-blue-900 ml-1">Pal</span>
        </button>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm text-gray-500">
            OR CONTINUE BELOW TO PAY WITH A CREDIT CARD
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/*<h2 className="text-xl font-medium mb-4">Contact information</h2>

         <div className="mb-6 flex justify-between items-center">
          <div className="w-full relative">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              showLabel={false}
            />
          </div>
          <div className="ml-4 text-right">
            <span className="text-sm">Already have an account? </span>
            <a href="/login" className="text-sm underline">
              Log in
            </a>
          </div>
        </div> 

        <div className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            id="receiveNews"
            name="receiveNews"
            checked={formData.receiveNews}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "receiveNews",
                  value: e.target.checked ? "true" : "false",
                  type: "checkbox",
                  checked: e.target.checked,
                },
              })
            }
          />
          <label htmlFor="receiveNews" className="text-sm">
            Email me with news and offers
          </label>
        </div>
        */}

        <h2 className="text-xl font-medium mb-4">Shipping address</h2>

        {/* <div className="mb-4 relative">
          <div
            className="p-3 border border-gray-300 rounded flex justify-between items-center cursor-pointer"
            onClick={() => setShowCountryDropdown(!showCountryDropdown)}>
            <span className="text-gray-700">United States</span>
            <FaChevronDown size={16} />
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="First name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <Input
            label="Last name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <Input
            label="Address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <Input
            label="Apartment, suite, etc. (optional)"
            type="text"
            name="apartment"
            value={formData.apartment}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="City"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />

          <Input
            label="ZIP code"
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
          />
        </div>

        <div className="mb-8 relative">
          <Input
            label="Phone (optional)"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {formData.phone && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FaQuestionCircle size={16} />
            </span>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="cursor-pointer bg-dark hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xs">
            CONTINUE TO SHIPPING
          </button>
        </div>
      </form>
    </div>
  );
};

Checkout.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default Checkout;
