import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Rating, Star } from "@smastrom/react-rating";
import Loading from "../../components/Loading";
import axios from "axios";
import ProductReviews from "../../components/ProductReviews";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify"; 

const myStyles = {
  itemShapes: Star,
  itemStrokeWidth: 1,
  activeFillColor: "#212121",
  activeStrokeColor: "#212121",
  inactiveFillColor: "#fff",
  inactiveStrokeColor: "#212121",
};

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const { fetchCartItems } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/products/${id}/`
        );
        setProduct(response.data);
        setCurrentImage(response.data.images[0]?.image || null);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <Loading />;
  }

  const {
    name,
    description,
    price,
    discount_price,
    images,
    available_sizes,
    available_colors,
    reviews,
  } = product;

  const finalPrice = discount_price || price;

  const handleSizeSelection = (size) => {
    setSelectedSize(size === selectedSize ? null : size);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: "",
    comment: "",
  });

  const handleColorSelection = (color) => {
    setSelectedColor(color === selectedColor ? null : color);
  };

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length ||
    0;

  const addToCart = async (product_id, quantity = 1) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/cart/add/`,
        {
          product_id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      fetchCartItems();

      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const handleReviewChange = (e) => {
    setNewReview({
      ...newReview,
      [e.target.name]: e.target.value,
    });
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/reviews/products/${productTitle}/reviews/`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");

    if (!token) {
      toast.error("Please login first.");
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/reviews/products/${productTitle}/reviews/`,
        {
          rating: newReview.rating,
          comment: newReview.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Review submitted successfully.");

      setNewReview({
        rating: "",
        comment: "",
      });

      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    }
  };

  return (
    <div className="wrapper mb-24 mt-10">
      <div
        className={`w-full flex flex-col lg:flex-row justify-between lg:gap-4 ${
          images.length <= 1 ? "gap-4" : "gap-16 "
        }`}>
        <div className="w-full lg:w-1/2 h-fit flex flex-col-reverse lg:flex-row justify-between gap-4 lg:sticky lg:top-24">
          <div className="flex flex-row lg:flex-col gap-2">
            {images.map((image) => (
              <div
                key={image.id}
                onClick={() => setCurrentImage(image.image)}
                className={`w-[calc(100%/${
                  images.length
                })] lg:w-[70px] aspect-auto bg-[#f5f5f5] ${
                  image.image === currentImage
                    ? "border-[2px] border-gray-700 rounded-xs"
                    : ""
                }`}
              >
                <img
                  src={`http://127.0.0.1:8000/${image.image}`}
                  alt=""
                  className="w-full h-full cursor-pointer"
                />
              </div>
            ))}
          </div>
          <div className="w-full bg-[#f5f5f5]">
            <img
              src={`http://127.0.0.1:8000/${currentImage}`}
              alt=""
              className="w-full"
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 pl-0 lg:pl-8 space-y-8">
          <h2 className="font-bold text-3xl tracking-wide capitalize">
            {name}
          </h2>
          <p className="text-md">{description}</p>
          <p className="text-lg space-x-3">
            <span className="font-semibold">{finalPrice} EGP</span>
            {discount_price && (
              <span className="text-gray-600 line-through">{price} EGP</span>
            )}
          </p>

          <Rating
            style={{ maxWidth: 100 }}
            value={averageRating}
            onChange={setRating}
            itemStyles={myStyles}
            readOnly={true}
          />

          <div className="space-y-2">
            <span className="block text-sm font-semibold uppercase">
              select color :
            </span>
            <div className="flex gap-2 flex-wrap">
              {available_colors.map((color, index) => (
                <span
                  key={index}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelection(color)}
                  className={`block w-[35px] h-[35px] rounded-full cursor-pointer border-[1px] border-gray-400 hover:opacity-[85%] ${
                    selectedColor === color
                      ? "border-[3px] border-gray-400"
                      : ""
                  }`}
                ></span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-sm font-semibold uppercase">
              select size :
            </span>
            <div className="flex gap-2 flex-wrap">
              {available_sizes.map((size, index) => (
                <span
                  key={index}
                  onClick={() => handleSizeSelection(size)}
                  className={`block w-[50px] h-[50px] rounded-xs text-[#212121] border-[1px] border-[#212121] flex-center cursor-pointer hover:bg-gray-400 transition-all duration-300 ${
                    size === selectedSize ? "bg-dark text-light" : ""
                  }`}
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => addToCart(id)}
            className={`w-full h-[50px] text-light uppercase font-medium text-lg tracking-wider rounded-xs transition-colors duration-300 ${
              selectedSize
                ? "cursor-pointer bg-dark hover:bg-gray-500"
                : "cursor-not-allowed bg-gray-400 text-yellow-600"
            }`}
            disabled={!selectedSize}
          >
            {selectedSize ? `add to cart - ${price} egp` : "select a size"}
          </button>
        </div>
      </div>

      <ProductReviews
        name={name}
        averageRating={averageRating}
        reviews={reviews}
      />
      <div className="w-full my-20">
        <div className="flex flex-col items-center mb-10">
          <h2 className="font-bold text-3xl tracking-wide mb-6">
            {productTitle}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-6xl font-semibold">{ratingsAverage}</h3>
            <div className="flex flex-col items-start gap-1">
              <Rating
                style={{ maxWidth: 130 }}
                value={ratingsAverage}
                itemStyles={myStyles}
                readOnly
              />
              <p className="font-light text-sm">168 Reviews</p>
            </div>
          </div>
        </div>

        <div className="divide-y-[1px] divide-[#EAEAEA] border-y-[1px] border-y-[#EAEAEA]">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="flex items-start justify-between py-12"
              >
                <div className="space-y-2">
                  <Rating
                    style={{ maxWidth: 130 }}
                    value={review.rating}
                    itemStyles={myStyles}
                    readOnly
                  />
                  <p className="mt-6">{review.comment}</p>
                </div>
                <div className="font-semibold text-md bg-[#f5f5f5] w-1/4 h-[50px] px-6 flex items-center">
                  {review.user_name} {/* اسم المستخدم لو حابب تعرضه */}
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg text-center mt-6 text-gray-500">
              No reviews yet. Be the first to write one!
            </p>
          )}

          {/* Form to add new review */}
          <form onSubmit={handleReviewSubmit} className="space-y-4 py-8">
            <h3 className="text-xl font-semibold">Add a Review</h3>

            <input
              type="number"
              name="rating"
              placeholder="Rating (1-5)"
              value={newReview.rating}
              onChange={handleReviewChange}
              min="1"
              max="5"
              required
              className="w-full border rounded px-3 py-2"
            />

            <textarea
              name="comment"
              placeholder="Your Comment"
              value={newReview.comment}
              onChange={handleReviewChange}
              required
              className="w-full border rounded px-3 py-2"
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Product;
