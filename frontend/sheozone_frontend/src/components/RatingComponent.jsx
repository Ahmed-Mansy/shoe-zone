import React, { useState, useEffect } from "react";
import api from "../api";

const RatingComponent = ({ productId }) => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await api.get(`/products/${productId}/reviews/`);
        setRatings(response.data);
        if (response.data.length > 0) {
          const total = response.data.reduce((sum, r) => sum + r.score, 0);
          setAverageRating(total / response.data.length);
        } else {
          setAverageRating(0);
        }
        setError(null);
      } catch (err) {
        setError(err.response?.data || "Error fetching ratings");
      }
    };

    fetchRatings();
  }, [productId]);

  const handleSubmitRating = async () => {
    const currentUser = localStorage.getItem("userId");
    if (ratings.some((r) => r.user == currentUser)) {
      alert("You have already submitted a review for this product.");
      return;
    }
    if (newRating < 1 || newRating > 5) {
      alert("Please select a rating between 1 and 5 stars.");
      return;
    }

    try {
      const response = await api.post(`/products/${productId}/reviews/`, {
        score: newRating,
      });

      if (response.data.product_avg_rating !== undefined) {
        setAverageRating(response.data.product_avg_rating);
      } else {
        const totalScore = updatedRatings.reduce(
          (sum, rating) => sum + rating.score,
          0
        );
        const newAvgRating = totalScore / updatedRatings.length;
        setAverageRating(newAvgRating);
      }

      setNewRating(0);
      setError(null);
    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response?.data?.non_field_errors
      ) {
        setError(err.response.data.non_field_errors[0]);
      } else {
        setError(err.response?.data || "Error submitting rating");
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-yellow-400" : "text-gray-400"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-semibold mb-4">Ratings</h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* Average Rating */}
      <div className="mb-6">
        <h4 className="text-lg font-medium">
          Average Rating:{" "}
          {averageRating ? averageRating.toFixed(1) : "No ratings yet"} / 5
        </h4>
        <div className="text-xl mt-1">
          {renderStars(Math.round(averageRating))}
        </div>
      </div>

      {/* Ratings List */}
      <div className="mb-6 space-y-4">
        {ratings.map((rating) => (
          <div
            key={rating.id}
            className="border border-gray-200 rounded p-4 shadow-sm"
          >
            <div className="text-lg">{renderStars(rating.score)}</div>
            <p className="text-sm text-gray-600 font-semibold">{rating.user}</p>
          </div>
        ))}
      </div>

      {/* Submit New Rating */}
      <div className="border rounded p-6 bg-gray-50 shadow-md">
        <h4 className="text-lg font-semibold mb-4">Submit Your Rating</h4>
        <div className="mb-4">
          <label htmlFor="rating" className="block mb-2 font-medium">
            Rating (1-5 Stars):
          </label>
          <select
            id="rating"
            className="w-full p-2 border border-gray-300 rounded"
            value={newRating}
            onChange={(e) => setNewRating(Number(e.target.value))}
          >
            <option value="0">Select Rating</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} Star{star > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleSubmitRating}
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
};

export default RatingComponent;
