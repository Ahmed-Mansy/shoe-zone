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

// {
//       "id": "m001",
//       "badge": "new",
//       "price": 129.99,
//       "title": "Men's Trail Running Shoes",
//       "colors": ["black", "gray", "blue"],
//       "sizes": [40, 41, 42, 43, 44, 45],
//       "productImage": "https://example.com/images/mens-trail-running-shoes.jpg"
//     },
