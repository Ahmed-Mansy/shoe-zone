import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get("http://127.0.0.1:8000/api/products/crud/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const deleteProduct = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/products/crud/products/${id}/`)
      .then(() => {
        fetchProducts(); // refresh list after delete
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">All Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded-lg shadow bg-white hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="mb-1">
              Price: <span className="font-medium">{product.price} EGP</span>
            </p>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 ${
                      i <= Math.floor(product.average_rating)
                        ? "text-orange-500"
                        : "text-gray-300"
                    }`}
                    fill={i <= product.average_rating ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>

              <span className="text-sm font-medium text-gray-800">
                {product.average_rating?.toFixed(1) || "0.0"}
              </span>
            </div>

            <p className="mb-2 text-sm text-gray-500">
              {product.in_stock ? "In Stock" : "Out of Stock"}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => console.log("Edit", product.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => deleteProduct(product.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
