import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/";

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
    console.error("Error fetching dashboard stats:", error);
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
    "Content-Type": "application/json",
  },
};

// Get categories
export const getCategories = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}products/crud/categories/`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories", error);
  }
};

// Get all products
export const getProducts = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}products/crud/products/`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products", error);
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}products/crud/products/`,
      productData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating product", error);
  }
};

// Update a product
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(
      `products/crud/products/${productId}/`,
      productData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product", error);
  }
};

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`products/crud/products/${productId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product", error);
  }
};

const API = axios.create({
  baseURL: "/api/orders/crud/orders",
  // headers: {
  //   Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  // },
});

// Orders APIs
export const fetchOrders = () => API.get(`${BASE_URL}orders/crud/orders/`);
export const updateOrderStatus = (id, status) =>
  API.patch(`${BASE_URL}orders/crud/orders/${id}/`, { status });
export const deleteOrder = (id) =>
  API.delete(`${BASE_URL}orders/crud/orders/${id}/`);

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}users/profile/${userId}/`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const updateUserProfile = async (userId, updateData) => {
    const response = await axios.put(
      `${BASE_URL}users/user/${userId}/`, 
      updateData,
    );
    return response.data;
};

// Delete user account
export const deleteUserAccount = async (userId, password) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}users/user/${userId}/`,
      {
        data: { password },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

export const getProductRatings = async (productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/products/${productId}/ratings/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product ratings:", error);
    throw error;
  }
};


export const submitProductRating = async (productId, score) => {
  try {
    const token = localStorage.getItem("access"); 
    const response = await axios.post(
      `${BASE_URL}/products/${productId}/ratings/`,
      { score },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting product rating:", error);
    throw error;
  }
};