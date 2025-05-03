import { Rating, Star } from "@smastrom/react-rating";
import PropTypes from "prop-types";

const myStyles = {
  itemShapes: Star,
  itemStrokeWidth: 1,
  activeFillColor: "#212121",
  activeStrokeColor: "#212121",
  inactiveFillColor: "#fff",
  inactiveStrokeColor: "#212121",
};

const ProductReviews = ({ name, averageRating, reviews }) => {
  return (
    <div className="w-full my-20">
      <div className="flex flex-col items-center mb-10">
        <h2 className="font-bold text-3xl tracking-wide mb-6 capitalize">
          {name}
        </h2>
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-6xl font-semibold">{averageRating}</h3>
          <div className="flex flex-col items-start gap-1">
            <Rating
              style={{ maxWidth: 130 }}
              value={averageRating}
              itemStyles={myStyles}
              readOnly
            />
            <p className="font-light text-sm">{reviews.length} Reviews</p>
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
                <p className="mt-6">{review.comment}</p>
              </div>
              <div className="font-semibold text-md bg-[#f5f5f5] w-1/4 h-[50px] px-6 flex items-center">
                {review.user.slice(0, review.user.indexOf("@")).toUpperCase()}
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
  );
};

ProductReviews.propTypes = {
  name: PropTypes.string.isRequired,
  averageRating: PropTypes.number.isRequired,
  reviews: PropTypes.array.isRequired,
};
export default ProductReviews;
