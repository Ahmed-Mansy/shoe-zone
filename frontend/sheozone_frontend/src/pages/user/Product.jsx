import { useEffect, useState } from "react";
import { productImages } from "../../data.json";
import { useParams } from "react-router";
import { Rating, Star } from "@smastrom/react-rating";
import { fetchProductDetails, getProductRatings } from "../../api";
import Loading from "../../components/Loading";

const myStyles = {
  itemShapes: Star,
  itemStrokeWidth: 1,
  activeFillColor: "#212121",
  activeStrokeColor: "#212121",
  inactiveFillColor: "#fff",
  inactiveStrokeColor: "#212121",
};

const sizes = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

const colors = ["black", "white", "gray", "red", "yellow", "blue"];

const reviews = [
  {
    id: 1,
    rating: 5,
    title: "Love these! Very comfortable and",
    description: "Love these! Very comfortable and stylish!",
    reviewerName: "Haylee C.",
  },
  {
    id: 2,
    rating: 4,
    title: "Really good shoes!",
    description: "They fit perfectly and feel great during long walks.",
    reviewerName: "Michael B.",
  },
  {
    id: 3,
    rating: 5,
    title: "Best purchase ever",
    description: "Amazing quality and very comfortable. Highly recommend!",
    reviewerName: "Sarah P.",
  },
  {
    id: 4,
    rating: 3,
    title: "Good but not perfect",
    description: "The design is nice, but I expected better cushioning.",
    reviewerName: "David L.",
  },
  {
    id: 5,
    rating: 4,
    title: "Stylish and comfy",
    description: "Very stylish shoes, and comfortable for daily use.",
    reviewerName: "Emma R.",
  },
];

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [currentImage, setCurrentImage] = useState(productImages[0]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await fetchProductDetails(id);
      setProduct(data);
    };

    const getProductRating = async () => {
      const data = await getProductRatings(id);
      setAverageRating(data);
      console.log(data);
    };

    fetchProduct();
    // getProductRating();
  }, [id, product]);

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
  } = product;

  const finalPrice = discount_price || price;

  const handleSizeSelection = (e) => {
    let clickedSize = +e.target.innerHTML;

    clickedSize === selectedSize
      ? setSelectedSize(null)
      : setSelectedSize(clickedSize);
  };

  const handleColorSelection = (color) => {
    let clickedColor = color;

    clickedColor === selectedColor
      ? setSelectedColor(null)
      : setSelectedColor(clickedColor);
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
                className={`w-[calc(100%/${
                  productImages.length
                })] lg:w-[70px] aspect-auto bg-[#f5f5f5] ${
                  image.image === currentImage.image
                    ? "border-[2px] border-gray-700 rounded-xs"
                    : ""
                }`}>
                <img
                  src={image.image}
                  alt=""
                  className="w-full h-full cursor-pointer"
                  onClick={() => setCurrentImage(image)}
                />
              </div>
            ))}
          </div>
          <div className="w-full bg-[#f5f5f5]">
            <img src={currentImage.image} alt="" className="w-full" />
          </div>
        </div>

        <div className="w-full lg:w-1/2 pl-0 lg:pl-8 space-y-8">
          <h2 className="font-bold text-2xl tracking-wide">{name}</h2>
          <p className="text-md">{description}</p>
          <p className="text-lg space-x-3">
            <span className="font-semibold">{finalPrice} EGP</span>
            <span className="text-gray-600 line-through">
              {discount_price && <span>{price} EGP</span>}
            </span>
          </p>

          <Rating
            style={{ maxWidth: 100 }}
            value={rating}
            onChange={setRating}
            itemStyles={myStyles}
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
                  className={`block w-[35px] h-[35px] rounded-full  cursor-pointer border-[1px] border-gray-400 hover:opacity-[85%] ${
                    selectedColor === color
                      ? "border-[3px] border-gray-400"
                      : ""
                  }`}></span>
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
                  onClick={handleSizeSelection}
                  className={`block w-[50px] h-[50px] rounded-xs text-[#212121] border-[1px] border-[#212121] flex-center cursor-pointer hover:bg-gray-400 transition-all duration-300 ${
                    size === selectedSize ? "bg-dark text-light" : ""
                  }`}>
                  {size}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`w-full h-[50px] bg-dark text-light uppercase font-medium text-lg tracking-wider rounded-xs transition-colors duration-300 ${
              selectedSize
                ? "cursor-pointer hover:bg-gray-500"
                : "cursor-not-allowed bg-gray-400 text-yellow-600"
            }`}
            disabled={!selectedSize}>
            {selectedSize ? `add to cart - ${finalPrice} egp` : "select a size"}
          </button>
        </div>
      </div>

      <div className="w-full my-20">
        <div className="flex flex-col items-center mb-10">
          <h2 className="font-bold text-3xl tracking-wide mb-6">{name}</h2>
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-6xl font-semibold">{averageRating}</h3>
            <div className="flex flex-col items-start gap-1">
              <Rating
                style={{ maxWidth: 130 }}
                value={averageRating}
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
                className="flex items-start justify-between py-12">
                <div className="space-y-2">
                  <Rating
                    style={{ maxWidth: 130 }}
                    value={review.rating}
                    itemStyles={myStyles}
                    readOnly
                  />
                  <h2 className="text-xl font-semibold">{review.title}</h2>
                  <p className="mt-6">{review.description}</p>
                </div>
                <div className="font-semibold text-md bg-[#f5f5f5] w-1/4 h-[50px] px-6 flex items-center">
                  {review.reviewerName}
                </div>
              </div>
            ))
          ) : (
            <h2 className="text-3xl font-medium text-center mt-6">
              There is no reviews to show.
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
