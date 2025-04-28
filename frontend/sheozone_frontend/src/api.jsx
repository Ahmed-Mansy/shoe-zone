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
//////////////////////////////////////////////////
// Get all products

export const fetchProducts = async () => {
  const response = await axios.get(`${API_URL}/products/crud/products/`);
  return response.data;
};

export const fetchProductDetails = async (id) => {
  const response = await axios.get(`${API_URL}/products/crud/products/${id}/`);
  return response.data;
};

export const createProduct = async (product) => {
  const response = await axios.post(`${API_URL}/products/crud/products/`, product);
  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await axios.put(`${API_URL}/products/crud/products/${id}/`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${BASE_URL}products/crud/products/${id}/`);
  return response.data;
};

///////////////////////////////////////////////////////////////
const API = axios.create({
  baseURL: '/api/orders/crud/orders',
  // headers: {
  //   Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  // },
});

// Orders APIs
export const fetchOrders = () => API.get(`${BASE_URL}orders/crud/orders/`);
export const updateOrderStatus = (id, status) =>
  API.patch(`${BASE_URL}orders/crud/orders/${id}/`, { status });
export const deleteOrder = (id) => API.delete(`${BASE_URL}orders/crud/orders/${id}/`);