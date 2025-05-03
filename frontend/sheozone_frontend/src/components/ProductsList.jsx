import PropTypes from "prop-types";
import ProductCard from "./ProductCard";

const ProductsList = ({ products }) => {
  return (
    <div className="w-full mt-4 flex justify-between flex-wrap gap-3">
      {products.map((product) => {
        return <ProductCard key={product.id} product={product} />;
      })}
    </div>
  );
};

ProductsList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default ProductsList;
