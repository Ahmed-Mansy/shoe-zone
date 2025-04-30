import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const response = await fetch(
          `http://127.0.0.1:8000/api/products/crud/products/${id}`
        );
        const data = await response.json();
        setProduct(data);
      };
      fetchProduct();
    }

    const fetchCategories = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/api/products/crud/categories/"
      );
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setProduct({
      ...product,
      images: Array.from(e.target.files),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      if (key === "images") {
        product.images.forEach((image) => formData.append("images", image));
      } else {
        formData.append(key, product[key]);
      }
    });

    const url = existingProduct
      ? `http://127.0.0.1:8000/api/products/crud/products/${existingProduct.id}/`
      : "http://127.0.0.1:8000/api/products/crud/products/";
    const method = existingProduct ? "put" : "post";

    axios({
      method,
      url,
      data: formData,
    })
      .then((response) => {
        // handle success
        toast.success(
          `${
            existingProduct ? "Product updated" : "Product added"
          } successfully!`
        );
        navigate("/products");
      })
      .catch((error) => {
        // handle error
        toast.error("Error submitting form");
        console.error(error);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container p-4 w-50 mx-auto my-5 shadow-lg bg-white rounded">
      <h1 className="text-center mb-4 p-3">
        {id ? "Edit Product" : "Add Product"}
      </h1>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Product Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={product.name}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter product name"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter product description"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="price" className="form-label">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={product.price}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter price"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="discount_price" className="form-label">
          Discount Price
        </label>
        <input
          type="number"
          id="discount_price"
          name="discount_price"
          value={product.discount_price || ""}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter discount price"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="category_id" className="form-label">
          Category
        </label>
        <select
          id="category_id"
          name="category_id"
          value={product.category_id}
          onChange={handleChange}
          className="form-control"
          required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="stock_quantity" className="form-label">
          Stock Quantity
        </label>
        <input
          type="number"
          id="stock_quantity"
          name="stock_quantity"
          value={product.stock_quantity}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter stock quantity"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="sizes" className="form-label">
          Sizes (comma separated)
        </label>
        <input
          type="text"
          id="sizes"
          name="sizes"
          value={product.sizes || ""}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter sizes"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="colors" className="form-label">
          Colors (comma separated)
        </label>
        <input
          type="text"
          id="colors"
          name="colors"
          value={product.colors || ""}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter colors"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="material" className="form-label">
          Material
        </label>
        <input
          type="text"
          id="material"
          name="material"
          value={product.material || ""}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter material"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="image" className="form-label">
          Product Image
        </label>
        <input
          type="file"
          id="images"
          name="images"
          onChange={handleFileChange}
          multiple
          className="form-control"
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">
        {id ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

ProductForm.propTypes = {
  existingProduct: PropTypes.object.isRequired,
};

export default ProductForm;
