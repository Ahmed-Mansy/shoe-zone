import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
import Swal from 'sweetalert2';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryType, setCategoryType] = useState("women");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const isEditing = editingCategoryId !== null;
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const navigate = useNavigate();

  const checkIfAdmin = () => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "admin") {
      setIsAdmin(true);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/products/crud/categories/"
      );
      const sortedCategories = response.data.sort((a, b) => a.id - b.id);
      setCategories(sortedCategories);
    } catch (error) {
      toast.error("Error loading categories. Please try again.");
    }
  };
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
  
    if (!isAdmin) {
      toast.error("You must be an admin to perform this action.");
      return;
    }
  
    if (newCategory.trim() === "") {
      toast.error("Category name cannot be empty.");
      return;
    }
  
    // تحقق من وجود الكاتيجوري بنفس الاسم والنوع
    const exists = categories.some(
      (cat) =>
        cat.name.toLowerCase() === newCategory.trim().toLowerCase() &&
        cat.type === categoryType &&
        (!isEditing || cat.id !== editingCategoryId) // استثناء الحالة اللي بتعدل فيها
    );
  
    if (exists) {
      toast.error("Category with the same name and type already exists.");
      return;
    }
  
    const categoryData = {
      name: newCategory,
      type: categoryType,
    };
  
    try {
      if (isEditing) {
        await axios.put(
          `http://127.0.0.1:8000/api/products/crud/categories/${editingCategoryId}/`,
          categoryData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Category updated successfully!");
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/products/crud/categories/",
          categoryData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Category added successfully!");
      }
  
      setNewCategory("");
      setCategoryType("women");
      setEditingCategoryId(null);
      fetchCategories();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data;
        if (errorData && typeof errorData === 'object') {
          const errorMessages = Object.values(errorData).flat().join(', ');
          toast.error(`Error: ${errorMessages}`);
        } else {
          toast.error("Invalid category data.");
        }
      } else {
        toast.error("Failed to save category.");
      }
  
    }
  };
  


const handleDeleteCategory = async (id) => {
  const token = localStorage.getItem("accessToken");

  if (!isAdmin) {
    toast.error("You must be an admin to perform this action.");
    return;
  }

  const confirmResult = await Swal.fire({
    title: 'Are you sure?',
    text: "This action will delete the category permanently!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (confirmResult.isConfirmed) {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/products/crud/categories/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category.");
    }
  }
};


  const handleEditCategory = (cat) => {
    setNewCategory(cat.name);
    setCategoryType(cat.type || "women");
    setEditingCategoryId(cat.id);
  };

  const filterCategories = (type) => {
    if (type === "all") return categories;
    return categories.filter((cat) => cat.type === type);
  };

  useEffect(() => {
    checkIfAdmin();
    fetchCategories();
  }, []);

  return (
    <div className="container p-5">
      <ToastContainer />
      <h2 className="font-bold mb-5 m-4 text-2xl">Manage Categories</h2>

      <form onSubmit={handleSaveCategory} className="mx-5 flex gap-2 flex-wrap">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category name"
          className="border-[1px] border-gray-400 p-2 rounded w-1/2"
        />

        <select
          className="form-select w-1/4 mx-4 border-[1px] border-gray-400 rounded-sm px-2"
          value={categoryType}
          onChange={(e) => setCategoryType(e.target.value)}>
          <option value="women">Women</option>
          <option value="men">Men</option>
        </select>

        <button
          type="submit"
          className="btn bg-blue-500 text-white px-4 py-2 mx-2">
          {isEditing ? "Update" : "Add Category"}
        </button>
        {isEditing && (
          <button
            type="button"
            className="btn bg-red-500 text-white px-4 py-2"
            onClick={() => {
              setNewCategory("");
              setCategoryType("women");
              setEditingCategoryId(null);
            }}>
            Cancel
          </button>
        )}
      </form>

      <div className="text-center mt-5 mb-4">
        <div className="inline-flex mb-4 mt-4 w-1/2 shadow rounded overflow-hidden">
          <button
            className={`flex-1 px-4 py-2 text-sm font-semibold cursor-pointer ${
              selectedTab === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedTab("all")}>
            All
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-semibold cursor-pointer ${
              selectedTab === "women" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedTab("women")}>
            Women
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-semibold cursor-pointer ${
              selectedTab === "men" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedTab("men")}>
            Men
          </button>
        </div>
      </div>

      <div className="text-center mt-5 mb-4">
        <ul className="w-3/4 mx-auto my-4">
          {filterCategories(selectedTab).map((cat) => (
            <li key={cat.id} className="border p-3 rounded shadow-sm my-3">
              <div className="flex justify-between items-center">
                <h3>{cat.name}</h3>
                {isAdmin && (
                  <div className="flex space-x-2">
                    <button
                      className="bg-gray-500 text-white w-[80px] px-3 py-2 rounded-sm hover:bg-gray-600 cursor-pointer"
                      onClick={() => handleEditCategory(cat)}>
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white w-[80px] px-3 py-2 rounded-sm hover:bg-red-600 cursor-pointer"
                      onClick={() => handleDeleteCategory(cat.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryList;
