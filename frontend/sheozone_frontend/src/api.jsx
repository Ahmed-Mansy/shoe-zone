import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/";

export const getDashboardStats = async () => {
  try {
    const res = await axios.get(`${BASE_URL}orders/admin-dashboard/`);
    return res.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
};
//////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////
// Get all products
export const fetchProducts = async () => {
  const response = await axios.get(`${BASE_URL}/products/crud/products/`);
  return response.data;
};

export const fetchProductDetails = async (id) => {
  const response = await axios.get(`${BASE_URL}/products/crud/products/${id}/`);
  return response.data;
};

export const createProduct = async (product) => {
  const response = await axios.post(
    `${BASE_URL}/products/crud/products/`,
    product
  );
  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await axios.put(
    `${BASE_URL}/products/crud/products/${id}/`,
    product
  );
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(
    `${BASE_URL}products/crud/products/${id}/`
  );
  return response.data;
};
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

const API = axios.create({
  baseURL: "/api/orders/crud/orders",
});

// Orders APIs
export const fetchOrders = () => API.get(`${BASE_URL}orders/crud/orders/`);
export const updateOrderStatus = (id, status) =>
  API.patch(`${BASE_URL}orders/crud/orders/${id}/`, { status });
export const deleteOrder = (id) =>
  API.delete(`${BASE_URL}orders/crud/orders/${id}/`);

//////////////////////////////////////////////////////////
// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}users/register/`,
      userData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


//Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}users/login/`, userData);
    const { isAdmin, id, access, refresh } = response.data;

    localStorage.setItem("userRole", isAdmin ? "admin" : "user");
    localStorage.setItem("userId", id);
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    // localStorage.setItem("is_staff", is_staff);
    // localStorage.setItem("is_active", is_active); 

    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Login failed" };
  }
};


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
    updateData
  );
  return response.data;
};

// Delete user account
export const deleteUserAccount = async (userId, password) => {
  try {
    const response = await axios.delete(`${BASE_URL}users/user/${userId}/`, {
      data: { password },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

export const getProductRatings = async (productId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/products/${productId}/ratings/`
    );
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
