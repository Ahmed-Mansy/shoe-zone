import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';
const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('search');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/products/api/products/?search=${searchTerm}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching Products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  return (
    <div className="container mt-4">
  <h2 className="mx-2 px-10 py-10 text-2xl font-bold text-gray-800 text-center">
    Search Result: <strong>{searchTerm}</strong>
  </h2>

  {loading ? (
    <p>Loading ...</p>
  ) : products.length > 0 ? (
    <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-2 px-10 py-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  ) : (
    <p>No Results</p>
  )}
</div>

  );
};

export default SearchResults;
