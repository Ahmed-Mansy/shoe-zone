import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();

  const [topRated, setTopRated] = useState([]);
  const [latest, setLatest] = useState([]);

  const isLoggedIn = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("userRole");
  useEffect(() => {
    // if (!isLoggedIn || !userRole)
    //   toast.error("Unauthorized: Please login.");
    navigate("/");
    axios
      .get("http://127.0.0.1:8000/api/products/home/")
      .then((res) => {
        setTopRated(res.data.top_rated);
        setLatest(res.data.latest);
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  return (
    <div>
      <div className="w-full">
        <img
          src="/assets/images/banner.jpg"
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="wrapper my-5 py-10">
        {/* Top Rated Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Top Rated Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topRated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Latest Products Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Latest Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {latest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
