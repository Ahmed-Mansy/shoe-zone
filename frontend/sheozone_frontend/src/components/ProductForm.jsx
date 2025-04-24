import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as api from '../api'

const ProductForm = ({ product, onSubmit }) => {
    const [name, setName] = useState(product ? product.name : '');
    const [description, setDescription] = useState(product ? product.description : '');
    const [price, setPrice] = useState(product ? product.price : '');
    const [discountPrice, setDiscountPrice] = useState(product ? product.discount_price : '');
    const [stockQuantity, setStockQuantity] = useState(product ? product.stock_quantity : 0);
    const [category, setCategory] = useState(product ? product.category.id : '');
    const [image, setImage] = useState(null);
    const [averageRating, setAverageRating] = useState(product ? product.average_rating : 0);
    const [categories, setCategories] = useState([]);
    
    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            name,
            description,
            price,
            discount_price: discountPrice,
            stock_quantity: stockQuantity,
            category: category,
            image,
            average_rating: averageRating
        };
        
        if (product) {
            await updateProduct(product.id, productData);
        } else {
            await createProduct(productData);
        }
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Discount Price"
                value={discountPrice || ''}
                onChange={(e) => setDiscountPrice(e.target.value)}
            />
            <input
                type="number"
                placeholder="Stock Quantity"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                required
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select Category</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
            />
            <input
                type="number"
                placeholder="Average Rating"
                value={averageRating}
                onChange={(e) => setAverageRating(e.target.value)}
                required
            />
            <button type="submit">Save</button>
        </form>
    );
};

export default ProductForm;
