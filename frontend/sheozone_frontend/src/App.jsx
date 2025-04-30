import { Routes, Route } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import CategoryList from './pages/CategoryList'; 
import UserManagement from './pages/UserManagement'; 
import OrderManagement from './pages/OrderManagement';
import ProfilePage from './pages/ProfilePage';
import EditAddress from './pages/EditAddress';
import ProfileEdit from './pages/ProfileEdit';
import AccountDelete from "./pages/AccountDelete";


function App() {
  return(
  <>
  <div className="d-flex flex-column vh-100">
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />

            <Route path="/products" element={<ProductList />} />
            <Route path="/products/add" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/update-address" element={<EditAddress />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/profile/delete" element={<AccountDelete />} />
            
          </Routes>
        </div>
        <Footer />
      </div>
  </>)
  
}

export default App
