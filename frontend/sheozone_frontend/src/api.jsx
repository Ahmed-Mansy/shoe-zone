import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/';

// export const getDashboardStats = async () => {
//   //const token = localStorage.getItem('accessToken');
//   const res = await axios.get(`${BASE_URL}/orders/admin-dashboard/`)
//   //   , {
//   //   headers: {
//   //     Authorization: `Bearer ${token}`,
//   //   },
//   // });
//   return res.data;
// };

export const getDashboardStats = async () => {
  try {
    const res = await axios.get(`${BASE_URL}orders/admin-dashboard/`);
    return res.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
};

// const token = localStorage.getItem("accessToken");
// const config = {
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// };

// const config = {
//   headers: {  
//     Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//     'Content-Type': 'application/json',
//   },
// };
const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};


// Get categories
export const getCategories = async () => {
  try {
      const response = await axios.get(`${BASE_URL}products/crud/categories/`, config);
      return response.data;
  } catch (error) {
      console.error('Error fetching categories', error);
  }
};

// Get all products
export const getProducts = async () => {
  try {
      const response = await axios.get(`${BASE_URL}products/crud/products/`, config);
      return response.data;
  } catch (error) {
      console.error('Error fetching products', error);
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
      const response = await axios.post(`${BASE_URL}products/crud/products/`, productData);
      return response.data;
  } catch (error) {
      console.error('Error creating product', error);
  }
};

// Update a product
export const updateProduct = async (productId, productData) => {
  try {
      const response = await axios.put(`products/crud/products/${productId}/`, productData);
      return response.data;
  } catch (error) {
      console.error('Error updating product', error);
  }
};

// Delete a product
export const deleteProduct = async (productId) => {
  try {
      const response = await axios.delete(`products/crud/products/${productId}/`);
      return response.data;
  } catch (error) {
      console.error('Error deleting product', error);
  }
};