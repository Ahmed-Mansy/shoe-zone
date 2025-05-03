import PropTypes from "prop-types";
import ProductCard from "./ProductCard";

const ProductsList = ({ products }) => {
  return (
    <div className="w-full">
      {products && products.length > 0 ? (
        <div className="flex justify-between flex-wrap gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
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

ProductsList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default ProductsList;
