import React, { useState, useEffect } from "react";
import { getProductRatings, submitProductRating } from "../api"; 

const RatingComponent = ({ productId }) => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0); 
  const [newRating, setNewRating] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await api.get(`/products/${productId}/ratings/`);
        setRatings(response.data.ratings); 
        setAverageRating(response.data.avg_rating || 0); 
        setError(err.response?.data || "Error fetching ratings");
      }
    };

    fetchRatings();
  }, [productId]);

  const handleSubmitRating = async () => {
    if (newRating < 1 || newRating > 5) {
      alert("Please select a rating between 1 and 5 stars.");
      return;
    }

    try {
      const response = await api.post(`/products/${productId}/ratings/`, {
        score: newRating,
      });

      const updatedRatings = [...ratings, response.data];
      setRatings(updatedRatings);

      if (response.data.product_avg_rating !== undefined) {
        setAverageRating(response.data.product_avg_rating);
      } else {
        const totalScore = updatedRatings.reduce((sum, rating) => sum + rating.score, 0);
        const newAvgRating = totalScore / updatedRatings.length;
        setAverageRating(newAvgRating);
      }

      setNewRating(0);
      setError(null); 
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.non_field_errors) {
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
        <span key={i} className={i <= rating ? "text-warning" : "text-secondary"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="container mt-4">
      <h2>Ratings</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Average Rating */}
      <div className="mb-4">
        <h4>Average Rating: {averageRating ? averageRating.toFixed(1) : "No ratings yet"} / 5</h4>
        <div style={{ fontSize: "1.5rem" }}>{renderStars(Math.round(averageRating))}</div>
      </div>

      {/* Ratings List */}
      <div className="mb-4">
        {ratings.map((rating) => (
          <div key={rating.id} className="card mb-2">
            <div className="card-body">
              <div style={{ fontSize: "1.2rem" }}>{renderStars(rating.score)}</div>
              <p className="mb-1">
                <strong>{rating.user}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Submit New Rating */}
      <div className="card p-3">
        <h4>Submit Your Rating</h4>
        <div className="mb-3">
          <label htmlFor="rating" className="form-label">
            Rating (1-5 Stars):
          </label>
          <select
            id="rating"
            className="form-select"
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

        <button className="btn btn-primary" onClick={handleSubmitRating}>
          Submit Rating
        </button>
      </div>
    </div>
  );
};

export default RatingComponent;
