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
  const [error, setError] = useState("");

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
    if (name === "discount_price") {
      const intValue = parseInt(value, 10);

      if (isNaN(intValue) || intValue < 0 || intValue > 80) {
        setError("Discount must be between 0 and 80%");
        return;
      } else {
        setError("");
      }
    }
    setProduct({
      ...product,
      [name]: value,
    });
  };
  const [errors, setErrors] = useState({
    available_sizes: "",
    available_colors: "",
  });

  const handleListChange = (e, field) => {
    const { name, value } = e.target;
    if (name === "sizes" || name === "colors") {
      setProduct({
        ...product,
        [name]: value ? value.split(",").map((size) => size.trim()) : [], // تحويل النص إلى مصفوفة
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
      // if (key === "images") {
      //   product.images.forEach((image) => formData.append("images", image));
      if (key === "images") {
        if (product.images.length > 0 && product.images[0] instanceof File) {
          product.images.forEach((image) => formData.append("images", image));
        }
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
      <div className="mb-5 flex space-x-8">
        {/* Price */}
        <div className="mb-5 flex-1">
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
        <div className="flex-1">
          <label
            htmlFor="discount_price"
            className="block mb-2 text-dark font-medium">
            Discount percentage
          </label>
          <input
            type="number"
            id="discount_price"
            name="discount_price"
            value={product.discount_price || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter discount percentage"
            min={0}
            max={80}
            step={1}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
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
            required>
            <option value="">Select Type</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
          </select>
        </div>

        {/* Category */}
        <div className="flex-1 mx-2">
          <label
            htmlFor="category_id"
            className="block mb-2 text-dark font-medium">
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            value={product.category_id}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required>
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
            value={
              product.sizes && Array.isArray(product.sizes)
                ? product.sizes.join(", ")
                : ""
            }
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
            value={
              product.colors && Array.isArray(product.colors)
                ? product.colors.join(", ")
                : ""
            }
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
