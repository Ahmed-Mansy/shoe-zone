import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const ProductForm = ({ existingProduct }) => {
  const [product, setProduct] = useState(
    existingProduct || {
      name: "",
      description: "",
      price: "",
      discount_price: "",
      stock_quantity: "",
      sizes: "",
      colors: "",
      category_id: "",
      material: "",
      images: [],
    }
  );

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized: Please login as admin.");
      navigate("/login");
      return;
    }
    
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/products/crud/products/${id}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const productData = response.data;
          
          // تحديث بيانات المنتج بناءً على البيانات المسترجعة
          setProduct({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            discount_price: productData.discount_price || "",
            sizes: productData.available_sizes,
            colors: productData.available_colors,
            category_id: productData.category_id,
            stock_quantity: productData.stock_quantity,
            material: productData.material,
            images: productData.images,
          });
  
          // تعيين نوع الفئة إذا كانت موجودة
          setSelectedType(productData.category_type || "");
        } catch (error) {
          toast.error("Failed to load product data.");
          console.error(error);
        }
      };
      fetchProduct();
    }
  
    // تحميل الفئات
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/products/crud/categories/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(response.data);
      } catch (error) {
        toast.error("Failed to load categories.");
        console.error(error);
      }
    };
    fetchCategories();
  }, [id, navigate, token]);
  
  useEffect(() => {
    if (selectedType) {
      const filtered = categories.filter((cat) => cat.type === selectedType);
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  }, [selectedType, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };


  const handleListChange = (e, field) => {
    const { name, value } = e.target;
    if (name === "sizes" || name === "colors") {
      setProduct({
        ...product,
        [name]: value ? value.split(",").map(size => size.trim()) : [], // تحويل النص إلى مصفوفة
      });
    } else {
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };
  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    setProduct({ ...product, category_id: "" });
  };

  const handleFileChange = (e) => {
    setProduct({
      ...product,
      images: Array.from(e.target.files),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!token) {
      toast.error("Unauthorized: Please login as admin.");
      return;
    }
  
    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      if (key === "images") {
        product.images.forEach((image) => formData.append("images", image));
      } else {
        formData.append(key, product[key]);
      }
    });
  
    const url = id
      ? `http://127.0.0.1:8000/api/products/crud/products/${id}/`
      : "http://127.0.0.1:8000/api/products/crud/products/";
  
    const method = id ? "patch" : "post";
  
    axios({
      method,
      url,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        toast.success(
          `${id ? "Product updated" : "Product added"} successfully!`
        );
        navigate("/products");
      })
      .catch((error) => {
        toast.error("Error submitting form");
        console.error(error);
      });
  };
  
  
  return (
    <form
      onSubmit={handleSubmit}
      className="wrapper p-10 w-3/4 xl:w-1/2 my-10 bg-light rounded shadow-lg shadow-gray-300">
      <h1 className="text-center text-2xl font-semibold mb-6 text-primary">
        {id ? "Edit Product" : "Add Product"}
      </h1>

      {/* Product Name */}
      <div className="mb-5">
        <label htmlFor="name" className="block mb-2 text-dark font-medium">
          Product Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={product.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter product name"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-5">
        <label
          htmlFor="description"
          className="block mb-2 text-dark font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter product description"
          rows="4"
          required
        />
      </div>

      {/* Price */}
      <div className="mb-5">
        <label htmlFor="price" className="block mb-2 text-dark font-medium">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={product.price}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter price"
          required
        />
      </div>

      {/* Discount Price */}
      <div className="mb-5">
        <label
          htmlFor="discount_price"
          className="block mb-2 text-dark font-medium">
          Discount Price
        </label>
        <input
          type="number"
          id="discount_price"
          name="discount_price"
          value={product.discount_price || ""}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter discount price"
        />
      </div>

      <div className="mb-5 flex space-x-4">
  {/* Type */}
  <div className="flex-1">
    <label htmlFor="type" className="block mb-2 text-dark font-medium">
      Type
    </label>
    <select
      id="type"
      value={selectedType}
      onChange={handleTypeChange}
      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
      required
    >
      <option value="">Select Type</option>
      <option value="women">Women</option>
      <option value="men">Men</option>
    </select>
  </div>

  {/* Category */}
  <div className="flex-1 mx-2">
    <label htmlFor="category_id" className="block mb-2 text-dark font-medium">
      Category
    </label>
    <select
      id="category_id"
      name="category_id"
      value={product.category_id}
      onChange={handleChange}
      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
      required
    >
      <option value="">Select Category</option>
      {filteredCategories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
        </select>
      </div>
  </div>


      {/* Stock Quantity */}
      <div className="mb-5">
        <label
          htmlFor="stock_quantity"
          className="block mb-2 text-dark font-medium">
          Stock Quantity
        </label>
        <input
          type="number"
          id="stock_quantity"
          name="stock_quantity"
          value={product.stock_quantity}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter stock quantity"
          required
        />
      </div>


      <div className="mb-5 flex space-x-8">
  {/* Sizes */}
  <div className="flex-1 ">
    <label htmlFor="sizes" className="block mb-2 text-dark font-medium">
      Sizes (comma separated)
    </label>
    <input
      type="text"
      id="sizes"
      name="sizes"
      value={product.sizes && Array.isArray(product.sizes) ? product.sizes.join(", ") : ""}
      onChange={(e) => handleListChange(e, "available_sizes")}
      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
      placeholder="Enter sizes"
    />
  </div>

  {/* Colors */}
  <div className="flex-1 mx-2">
    <label htmlFor="colors" className="block mb-2 text-dark font-medium">
      Colors (comma separated)
    </label>
    <input
      type="text"
      id="colors"
      name="colors"
      value={product.colors && Array.isArray(product.colors) ? product.colors.join(", ") : ""}
      onChange={(e) => handleListChange(e, "available_colors")}
      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
      placeholder="Enter colors"
    />
  </div>
</div>

      

      {/* Material */}
      <div className="mb-5">
        <label htmlFor="material" className="block mb-2 text-dark font-medium">
          Material
        </label>
        <input
          type="text"
          id="material"
          name="material"
          value={product.material || ""}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter material"
        />
      </div>

      {/* Images */}
      <div className="mb-8">
        <label htmlFor="images" className="block mb-2 text-dark font-medium">
          Product Images
        </label>
        <input
          type="file"
          id="images"
          name="images"
          onChange={handleFileChange}
          multiple
          className="w-full p-3 border border-gray-300 rounded bg-light-gray cursor-pointer"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 rounded bg-primary text-light font-semibold hover:bg-dark transition-all cursor-pointer hover:opacity-90">
        {id ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

ProductForm.propTypes = {
  existingProduct: PropTypes.object.isRequired,
};

export default ProductForm;
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// const ProductForm = () => {
//   const { id } = useParams(); // للتأكد إذا كنا في حالة إضافة أو تعديل
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(
//     existingProduct || {
//       name: "",
//       description: "",
//       price: "",
//       discount_price: "",
//       stock_quantity: "",
//       sizes: "",
//       colors: "",
//       category_id: "",
//       material: "",
//       images: [],
//     }
//   );
//   const [newImages, setNewImages] = useState([]);

//   // إذا كان الـ id موجود، نقوم بتحميل بيانات المنتج للتعديل
//   useEffect(() => {
//     if (id) {
//       fetchProduct();
//     }
//   }, [id]);

//   const fetchProduct = async () => {
//     try {
//       const response = await axios.get(
//         `http://127.0.0.1:8000/api/products/products/${id}/`
//       );
//       setFormData({
//         name: response.data.name,
//         description: response.data.description,
//         price: response.data.price,
//         discount_price: response.data.discount_price || "",
//         available_sizes: response.data.available_sizes,
//         available_colors: response.data.available_colors,
//       });
//     } catch (error) {
//       console.error("Failed to load product:", error);
//       toast.error("Failed to load product");
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleListChange = (e, field) => {
//     const values = e.target.value.split(",").map((v) => v.trim());
//     setFormData((prev) => ({
//       ...prev,
//       [field]: values,
//     }));
//   };

//   const handleImageChange = (e) => {
//     setNewImages(e.target.files);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("accessToken");
//     if (!token) return toast.error("Unauthorized");

//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };

//     try {
//       if (id) {
//         // تحديث المنتج إذا كان id موجود
//         await axios.put(
//           `http://127.0.0.1:8000/api/products/products/${id}/`,
//           formData,
//           config
//         );
//       } else {
//         // إضافة منتج جديد إذا كان id غير موجود
//         await axios.post(
//           `http://127.0.0.1:8000/api/products/products/`,
//           formData,
//           config
//         );
//       }

//       // رفع صور جديدة (اختياري)
//       if (newImages.length > 0) {
//         const imgForm = new FormData();
//         for (let i = 0; i < newImages.length; i++) {
//           imgForm.append("images", newImages[i]);
//         }

//         if (id) {
//           // رفع الصور للمنتج المعدل
//           await axios.post(
//             `http://127.0.0.1:8000/api/products/${id}/add-images/`,
//             imgForm,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//         } else {
//           // رفع الصور للمنتج الجديد
//           await axios.post(
//             `http://127.0.0.1:8000/api/products/${id}/add-images/`,
//             imgForm,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//         }
//       }

//       toast.success(id ? "Product updated successfully!" : "Product added successfully!");
//       navigate(`/admin/products/${id || ""}`);
//     } catch (error) {
//       console.error("Operation failed:", error);
//       toast.error(id ? "Failed to update product" : "Failed to add product");
//     }
//   };

//   return (
//     <div className="wrapper mt-10 max-w-4xl mx-auto w-75">
//       <h2 className="text-3xl font-bold mb-6">{id ? "Edit Product" : "Add New Product"}</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block font-semibold">Name:</label>
//           <input
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//             className="w-full border p-2"
//           />
//         </div>

//         <div>
//           <label className="block font-semibold">Description:</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             className="w-full border p-2"
//           />
//         </div>

//         <div className="flex gap-4">
//           <div className="w-1/2">
//             <label className="block font-semibold">Price:</label>
//             <input
//               name="price"
//               type="number"
//               value={formData.price}
//               onChange={handleInputChange}
//               className="w-full border p-2"
//             />
//           </div>
//           <div className="w-1/2">
//             <label className="block font-semibold">Discount Price:</label>
//             <input
//               name="discount_price"
//               type="number"
//               value={formData.discount_price}
//               onChange={handleInputChange}
//               className="w-full border p-2"
//             />
//           </div>
//         </div>

//         {/* Category */}
//        <div className="mb-5">
//         <label htmlFor="category_id" className="block mb-2 text-dark font-medium">
//            Category
//          </label>
//          <select
//           id="category_id"
//           name="category_id"
//           value={product.category_id}
//           onChange={handleChange}
//           className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
//           required>
//           <option value="">Select Category</option>
//           {filteredCategories.map((cat) => (
//             <option key={cat.id} value={cat.id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//        </div>

//         <div>
//           <label className="block font-semibold">Sizes (comma separated):</label>
//           <input
//             value={formData.available_sizes.join(", ")}
//             onChange={(e) => handleListChange(e, "available_sizes")}
//             className="w-full border p-2"
//           />
//         </div>

//         <div>
//           <label className="block font-semibold">Colors (comma separated):</label>
//           <input
//             value={formData.available_colors.join(", ")}
//             onChange={(e) => handleListChange(e, "available_colors")}
//             className="w-full border p-2"
//           />
//         </div>

//         <div>
//           <label className="block font-semibold">Upload New Images:</label>
//           <input type="file" multiple onChange={handleImageChange} />
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//         >
//           {id ? "Save Changes" : "Add Product"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ProductForm;


