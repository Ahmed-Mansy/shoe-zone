import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const isEditing = editingCategoryId !== null;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products/crud/categories/');
      setCategories(response.data);
    } catch (error) {
      toast.error('Error loading categories. Please try again.');
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();

    if (newCategory.trim() === '') {
      toast.error('Category name cannot be empty.');
      return;
    }

    if (isEditing) {
      const originalCategory = categories.find(cat => cat.id === editingCategoryId);
      if (originalCategory && originalCategory.name === newCategory.trim()) {
        toast.info('No changes detected. Category name is the same.');
        return;
      }

      try {
        await axios.put(`http://127.0.0.1:8000/api/products/crud/categories/${editingCategoryId}/`, {
          name: newCategory,
        });
        setNewCategory('');
        setEditingCategoryId(null);
        fetchCategories();
        toast.success('Category updated successfully!');
        
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMsg = error.response.data?.name?.[0] || 'Validation error';
          toast.error(`Error: ${errorMsg}`);
        } else {
          toast.error('Something went wrong. Please try again.');
        }
      }

    } else {
      try {
        await axios.post('http://127.0.0.1:8000/api/products/crud/categories/', {
          name: newCategory,
        });
        setNewCategory('');
        fetchCategories();
        toast.success('Category added successfully!');
        
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMsg = error.response.data?.name?.[0] || 'Validation error';
          toast.error(`Error: ${errorMsg}`);
        } else {
          toast.error('Something went wrong. Please try again.');
        }
      }
      
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/crud/categories/${id}/`);
      fetchCategories();
      toast.success('Category deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete category.');
    }
  };

  const handleEditCategory = (cat) => {
    setNewCategory(cat.name);
    setEditingCategoryId(cat.id);
  };

  return (
    <div className="container p-5 ">
      <h2 className="font-bold m-4 p-4 ">All Categories</h2>

      <form onSubmit={handleSaveCategory} className="mx-5 ">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category name"
          className="border p-2 rounded w-25 mx-4"
        />
        <button
          type="submit"
          className={`btn btn-primary px-4 py-2 mx-2 ${isEditing }`}
        >
          {isEditing ? 'Update' : 'Add Category'}
        </button>
        {isEditing && (
          <button
            type="button"
            className="btn btn-danger px-4 py-2"
            onClick={() => {
              setNewCategory('');
              setEditingCategoryId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <ul className="w-50 m-3 p-5"> 
        {categories.map(cat => (
          <li key={cat.id} className="d-flex justify-content-between align-items-center border p-3 rounded shadow-sm m-2">
            <span className="flex-1">{cat.name}</span>
            <div className="flex gap-2 justify-end items-center"> 
              <button
                className="btn btn-warning px-3 py-1 "
                onClick={() => handleEditCategory(cat)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger px-3 py-1 mx-2"
                onClick={() => handleDeleteCategory(cat.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>


      <ToastContainer 
        position="top-left"   //position of the toast 
        autoClose={3000}       //auto close after 3 seconds
        newestOnTop={false}   //show the newest toast on bottom
        closeOnClick={true}   //close the toast on click
      />

    </div>
  );
};

export default CategoryList;
