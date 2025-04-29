import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product ,onDelete,onEdit }) => {

  const isAdmin = localStorage.getItem('userRole') === 'admin';


  const { name, price, discount_price, images, id } = product;
  const navigate = useNavigate();

  const finalPrice = discount_price || price;

  return (
    <div className="card">
      <img src={images || '/default-image.jpg'} alt={name} />
      <div className="card-body">
        <h5>{name}</h5>
        <p>{finalPrice} {discount_price && <span className="discounted">{price}</span>}</p>
        <Link to={`/product/${id}`} className="btn btn-primary">View Details</Link>
        {isAdmin && (
          <>
        <button onClick={() => navigate(`/products/edit/${product.id}`)} className="btn btn-secondary mx-2">Edit</button>
        <button onClick={() => onDelete(id)} className="btn btn-danger">Delete</button>
        </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;