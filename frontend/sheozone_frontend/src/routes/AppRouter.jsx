import { BrowserRouter, Routes, Route } from "react-router";
// Layouts
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/auth/ResetPassword";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import OrderManagement from "../pages/admin/OrderManagement";
import ProductList from "../pages/admin/ProductList";
import ProductForm from "../pages/admin/ProductForm";
import CategoryList from "../pages/admin/CategoryList";

// User Pages
import Home from "../pages/user/Home";
import About from "../pages/user/About";
import Profile from "../pages/user/Profile";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import Collection from "../pages/user/Collection";
import Product from "../pages/user/Product";

import Error from "../pages/user/Error";
// import ProductDetail from "../components/ProductDetail";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="/" element={<MainLayout />}>
          {/* Admin Routes */}
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/create" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<ProductForm />} />
          <Route path="/categories" element={<CategoryList />} />

          {/* User Routes */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="collections/:collectionTitle" element={<Collection />} />
          <Route path="products/:productTitle" element={<Product />} />
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
