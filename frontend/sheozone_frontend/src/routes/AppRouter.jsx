import { BrowserRouter, Routes, Route } from "react-router";
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import Stores from "../pages/Stores";
import Profile from "../pages/Profile";
import Cart from "../pages/Cart";
import Collection from "../pages/Collection";
import ResetPassword from "../pages/ResetPassword";
import Error from "../pages/Error";
import Product from "../pages/Product";

import AdminDashboard from "../pages/AdminDashboard";
import CategoryList from "../pages/CategoryList";
import UserManagement from "../pages/UserManagement";
import OrderManagement from "../pages/OrderManagement";
// import ProductList from "../components/ProductsList";
// import ProductForm from "../components/ProductForm";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="stores" element={<Stores />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="collections/:collectionTitle" element={<Collection />} />
          <Route path="products/:productTitle" element={<Product />} />

          <Route path="/dashboard" element={<AdminDashboard />} />
          {/* <Route path="/products" element={<ProductList />} /> */}
          {/* <Route path="/products/create" element={<ProductForm />} /> */}
          {/* <Route path="/products/edit/:id" element={<ProductForm />} /> */}
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
