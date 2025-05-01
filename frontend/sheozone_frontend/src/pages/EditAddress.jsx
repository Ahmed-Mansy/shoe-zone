import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditAddress = () => {
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    street: '',
    postcode: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        alert('Please login first.');
        navigate('/login');
        return;
      }

      const response = await axios.put('http://127.0.0.1:8000/addresses/update/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data);
      navigate('/profile');
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Failed to update address.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
      <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 className="text-center mb-4">Update Address</h2>

        <div className="mb-3">
          <label className="form-label">Country</label>
          <input
            type="text"
            className="form-control"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Street / House Address</label>
          <input
            type="text"
            className="form-control"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Postcode</label>
          <input
            type="text"
            className="form-control"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success w-50">Save Changes</button>
          <button type="button" className="btn btn-outline-primary w-50" onClick={() => navigate('/profile')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAddress;