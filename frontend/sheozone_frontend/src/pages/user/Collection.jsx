import { useParams, useSearchParams } from "react-router";
import ProductsList from "../../components/ProductsList";
import { useEffect, useState } from "react";
import axios from "axios";
import Filters from "../../components/Filters";

const Collection = () => {
  const { type, title } = useParams();
  const [products, setProducts] = useState(null);

  const [searchParams] = useSearchParams();
  const categoryId = +searchParams.get("categoryId");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/type/${type}/${title}/`
        );
        setProducts(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchProducts();
  }, [title, type]);

  return (
    <div className="wrapper py-10">
      <div className="flex-between pb-2">
        <div className="text-xs font-medium capitalize">
          <span>Home / </span>
          <span>{type} / </span>
          <span>{title}</span>
        </div>
        {/* <div className="border border-gray-300 rounded-full p-[2px] uppercase flex-center gap-1">
          <span
            className={`block rounded-full py-[2px] px-[4px] cursor-pointer w-[80px] font-medium text-center text-md ${
              collectionTitle == "women" ? "bg-primary text-light" : ""
            }`}>
            <Link to="/collections/2">women</Link>
          </span>
          <span
            className={`block rounded-full py-[2px] px-[4px] cursor-pointer w-[80px] font-medium text-center text-md ${
              collectionTitle == "men" ? "bg-primary text-light" : ""
            }`}>
            <Link to="/collections/1">men</Link>
          </span>
        </div> */}
      </div>
      <div className="flex justify-between items-start gap-6">
        <div className="w-1/4">
          <Filters
            collectionTitle={title}
            setProducts={setProducts}
            type={type}
            categoryId={categoryId}
          />
        </div>
        <div className="w-3/4">
          <ProductsList products={products} />
        </div>
      </div>
    </div>
  );
};

export default Collection;
