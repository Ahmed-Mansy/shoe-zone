import PropTypes from "prop-types";
import ProductCard from "./ProductCard";

const ProductsList = ({ products }) => {
  return (
    <div className="w-full">
      {products && products.length > 0 ? (
        <div className="flex flex-wrap gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-full lg:w-[calc(33%-24px)] xl:w-[calc(25%-16px)]">
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

ProductsList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default ProductsList;
