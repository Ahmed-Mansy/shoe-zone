import { Routes, Route } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import CategoryList from './pages/CategoryList'; 
import UserManagement from './pages/UserManagement'; 
import OrderManagement from './pages/OrderManagement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return(
  <>
  <ToastContainer 
          position="top-left"   //position of the toast 
          autoClose={3000}       //auto close after 3 seconds
          newestOnTop={false}   //show the newest toast on bottom
          closeOnClick={true}   //close the toast on click
  />
  <div className="d-flex flex-column vh-100">
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />

            <Route path="/products" element={<ProductList />} />
            <Route path="/products/create" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
            
          </Routes>
        </div>
        <Footer />
      </div>
  </>)
  
}

export default App
