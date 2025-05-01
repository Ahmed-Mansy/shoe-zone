import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getProduct } from "../api";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProduct(id);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const {
    name,
    description,
    price,
    discount_price,
    images,
    available_sizes,
    available_colors,
    average_rating,
  } = product;
  const finalPrice = discount_price || price;

  return (
    <div className="product-detail bg-yellow-200">
      <div className="product-images">
        {images.map((img, index) => (
          <img key={index} src={img.url} alt={`Product ${index}`} />
        ))}
      </div>
      <h1>{name}</h1>
      <p>{description}</p>
      <p>
        Price: {finalPrice}{" "}
        {discount_price && <span className="discounted">{price}</span>}
      </p>
      <p>
        Sizes:{" "}
        {available_sizes ? available_sizes.join(", ") : "No sizes available"}
      </p>
      <p>
        Colors: {available_colors ? available_colors.join(", ") : "No colors"}
      </p>
      <p>Rating: {average_rating ? average_rating : "No rating "}</p>
    </div>
  );
};

export default ProductDetail;
