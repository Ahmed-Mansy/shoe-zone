import { BrowserRouter, Routes, Route } from "react-router";
// Layouts
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/auth/ResetPassword";
import PasswordResetEmail from "../pages/auth/PasswordResetEmail.jsx";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import OrderManagement from "../pages/admin/OrderManagement";
import ProductList from "../pages/admin/ProductList";
import ProductForm from "../pages/admin/ProductForm";
import CategoryList from "../pages/admin/CategoryList";
import AdminProduct from "../pages/admin/AdminProduct";
// User Pages
import Home from "../pages/user/Home";
import About from "../pages/user/About";
// import Profile from "../pages/ProfilePage";
import ProfileEdit from "../pages/ProfileEdit.jsx";
import EditAddress from "../pages/EditAddress.jsx";
import AccountDelete from "../pages/AccountDelete.jsx";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import Collection from "../pages/user/Collection";
import Product from "../pages/user/Product";

import Error from "../pages/user/Error";
import ProfilePage from "../pages/ProfilePage";
import { CartProvider } from "../context/CartContext.jsx";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route
              path="reset-password-request"
              element={<PasswordResetEmail />}
            />
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
            <Route path="profile" element={<ProfilePage />} />
            <Route path="/profile/update-address" element={<EditAddress />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/profile/delete" element={<AccountDelete />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="collections/:type/:title" element={<Collection />} />
            <Route path="products/:id" element={<Product />} />
            <Route path="/admin/products/:id" element={<AdminProduct />} />
          </Route>

          <Route path="*" element={<Error />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
