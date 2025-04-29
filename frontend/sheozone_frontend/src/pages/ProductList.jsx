
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard'; 
import { toast } from 'react-toastify';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function ProductList() {

  const isAdmin = localStorage.getItem('userRole') === 'admin';

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/products/api/products/`);
      setProducts(response.data);
  } catch (error) { 
      console.error('Error fetching products', error);
  }
  };

  // 
  const handleDelete = async (productId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json', // Ensure Content-Type is correct
            },
          };
          await axios.delete(`http://127.0.0.1:8000/api/products/crud/products/${productId}/`,config);
          setProducts(products.filter(product => product.id !== productId));
          
          Swal.fire(
            'Deleted!',
            'The product has been deleted.',
            'success'
          );
        } catch (error) {
          console.error("Error deleting product", error);
          Swal.fire(
            'Error!',
            'Something went wrong while deleting.',
            'error'
          );
        }
      }
    });
  };

  const handleEdit = (productId) => {
    navigate(`products/edit/${productId}`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* <div>
        <ProductForm product={editingProduct} onSuccess={fetchProducts} />
      </div> */}
      <div className="grid grid-cols-1 gap-4">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onDelete={handleDelete} 
            onEdit={handleEdit} 
          />
        ))}
      </div>
      {isAdmin && (
      <div className="flex justify-center mt-4">
        <button
          className="btn btn-primary m-4"
          onClick={() => navigate('/products/create')}
        >
          Create New Product
        </button>
    </div>
      )}
    </div>
);
}
