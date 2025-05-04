import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Rating, Star } from "@smastrom/react-rating";
import Loading from "../../components/Loading";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const myStyles = {
  itemShapes: Star,
  itemStrokeWidth: 1,
  activeFillColor: "#212121",
  activeStrokeColor: "#212121",
  inactiveFillColor: "#fff",
  inactiveStrokeColor: "#212121",
};

const AdminProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

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

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/products/${id}/reviews/`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;

  const handleDelete = async (productId) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Unauthorized: Please login.");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };
          await axios.delete(
            `http://127.0.0.1:8000/api/products/crud/products/${productId}/`,
            config
          );
          navigate("/products");

          Swal.fire("Deleted!", "The product has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting product", error);
          Swal.fire("Error!", "Something went wrong while deleting.", "error");
        }
      }
    });
  };

  if (!product) return <Loading />;

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

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem("accessToken");
  
    if (!token) {
      toast.error("Unauthorized: Please login.");
      return;
    }
  
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://127.0.0.1:8000/api/products/reviews/${reviewId}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          toast.success("Review deleted successfully");
          fetchReviews(); // إعادة تحميل الريفيوهات بعد الحذف
        } catch (error) {
          console.error("Error deleting review", error);
          toast.error("Something went wrong while deleting.");
        }
      }
    });
  };
  

  return (
    <div className="wrapper mb-24 mt-10">
      <div className="w-full flex flex-col lg:flex-row justify-between lg:gap-16">
        {/* الصور */}
        <div className="w-full lg:w-1/2 flex flex-col-reverse lg:flex-row gap-4">
          <div className="flex flex-row lg:flex-col gap-2">
            {images.map((image) => (
              <div
                key={image.id}
                onClick={() => setCurrentImage(image.image)}
                className={`w-[calc(100%/${images.length})] lg:w-[70px] bg-[#f5f5f5] ${
                  image.image === currentImage
                    ? "border-[2px] border-gray-700 rounded-xs"
                    : ""
                }`}
              >
                <img
                  src={`http://127.0.0.1:8000/${image.image}`}
                  className="w-full h-full cursor-pointer"
                  alt=""
                />
              </div>
            ))}
          </div>
          <div className="w-full bg-[#f5f5f5]">
            {currentImage && (
              <img
                src={`http://127.0.0.1:8000/${currentImage}`}
                className="w-full"
                alt=""
              />
            )}
          </div>
        </div>

        {/* التفاصيل */}
        <div className="w-full lg:w-1/2 pl-0 lg:pl-8 space-y-8">
          <h2 className="font-bold text-3xl capitalize">{name}</h2>
          <p>{description}</p>
          <p className="text-lg space-x-3">
            <span className="font-semibold">{finalPrice} EGP</span>
            {discount_price && (
              <span className="text-gray-600 line-through">{price} EGP</span>
            )}
          </p>

          <Rating
            style={{ maxWidth: 100 }}
            value={averageRating}
            itemStyles={myStyles}
            readOnly
          />

          <div className="space-y-2">
            <span className="text-sm font-semibold uppercase">Colors:</span>
            <div className="flex gap-2 flex-wrap">
              {available_colors.map((color, idx) => (
                <span
                  key={idx}
                  style={{ backgroundColor: color }}
                  className="w-[35px] h-[35px] rounded-full border border-gray-400"
                ></span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-semibold uppercase">Sizes:</span>
            <div className="flex gap-2 flex-wrap">
              {available_sizes.map((size, idx) => (
                <span
                  key={idx}
                  className="block w-[50px] h-[50px] border border-[#212121] flex-center text-[#212121] flex items-center justify-center"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/products/edit/${id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xs"
            >
              Edit Product
            </button>
            <button
              onClick={() => handleDelete(id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xs"
            >
              Delete Product
            </button>
          </div>
        </div>
      </div>

      {/* عرض التقييمات فقط */}
      <div className="w-full my-20">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">{name}</h2>
          <div className="flex justify-center items-center gap-2 mt-4">
            <h3 className="text-5xl font-semibold">{averageRating.toFixed(1)}</h3>
            <div className="flex flex-col items-start gap-1">
              <Rating
                style={{ maxWidth: 130 }}
                value={averageRating}
                itemStyles={myStyles}
                readOnly
              />
              <p className="text-sm">{reviews.length} Reviews</p>
            </div>
          </div>
        </div>

        <div className="divide-y border-y">
          {reviews.length > 0 ? (
            reviews.map((review) => (
                <div key={review.id} className="py-8 flex justify-between items-start">
                    <div className="space-y-2">
                        <Rating
                        style={{ maxWidth: 130 }}
                        value={review.rating}
                        itemStyles={myStyles}
                        readOnly
                        />
                        <p className="mt-4">{review.comment}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="bg-[#f5f5f5] px-4 py-2 font-semibold">
                        {review.full_name}
                        </div>
                        <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
                        >
                        Delete
                        </button>
                    </div>
                </div>

            ))
          ) : (
            <p className="text-center py-6 text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProduct;
