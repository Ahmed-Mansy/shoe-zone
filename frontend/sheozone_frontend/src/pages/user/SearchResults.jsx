import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";
import Filters from "../../components/Filters";
import ProductCard from "../../components/ProductCard"; // تأكد إنه موجود

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search");

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
    <div className="wrapper mt-4">
      <h2 className="mx-2 px-10 py-10 text-2xl font-bold text-gray-800 text-center">
        Search Result: <strong>{searchTerm}</strong>
      </h2>

      {loading ? (
        <Loading />
      ) : (
        <div className="flex justify-between items-start gap-6">
          <div className="w-1/5">
            <Filters
              collectionTitle="Search"
              setProducts={setProducts}
              searchTerm={searchTerm}
            />
          </div>

          {products.length > 0 ? (
            // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  py-10">
            <div className="w-4/5 flex flex-wrap gap-6 py-10">
              {products.map((product) => (
                <div key={product.id} className="w-[calc(33%-12px)]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <p>No Results</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
