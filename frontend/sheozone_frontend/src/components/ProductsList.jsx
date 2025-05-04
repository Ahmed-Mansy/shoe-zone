import PropTypes from "prop-types";
import ProductCard from "./ProductCard";

const ProductsList = ({ products }) => {
  return (
    <div className="w-full">
      {products && products.length > 0 ? (
        <div className="flex justify-between flex-wrap gap-3">
          {products.map((product) => (
            <div key={product.id} className="w-[calc(33%-12px)]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <h2 className="text-3xl font-medium text-center mt-36">
          There is no items to show.
        </h2>
      )}
    </div>
  );
};


export default ProductsList;
