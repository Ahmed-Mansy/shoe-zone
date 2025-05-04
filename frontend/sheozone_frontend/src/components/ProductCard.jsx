import ImagesSlider from "./ImagesSlider";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom"; 


const ProductCard = ({ product, onDelete, onEdit }) => {
  const isAdmin = localStorage.getItem("userRole") === "admin";

  const { name, price, discount_price, images, id, available_colors } = product;
  const finalPrice = discount_price || price;

  return (
<div className="w-full relative space-y-3 mx-2 my-4 border border-gray-300 rounded-md p-4 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out">

      <Link to={`/products/${id}`} state={{ product }}>
        <div className="w-full aspect-square bg-[#f5f5f5] rounded-md overflow-hidden">
          {images.length > 0 ? (
            <ImagesSlider images={images} />
          ) : (
            <img
              src="/placeholder.jpg"
              alt={name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </Link>

      <h3 className="text-md font-semibold mt-2 capitalize text-center">{name}</h3>
      <div className="flex items-center gap-1 text-yellow-500 ">
        {Array.from({ length: 5 }, (_, index) => {
          const rating = Math.round(product.average_rating); 
          return index < rating ? (
            <FaStar key={index} />
          ) : (
            <FaRegStar key={index} />
          );
        })}
      </div>
    <div className="w-full relative space-y-3 mx-2 my-4">
      
      <h3 className="text-md font-semibold mt-2 capitalize">{name}</h3>

      <div className="flex-start gap-1">
        {available_colors.map((color, index) => (
          <span
            key={index}
            style={{ backgroundColor: color }}
            className="inline-block w-[25px] h-[25px] rounded-full border border-gray-900"
          ></span>
        ))}
      </div>

      <p className="text-md space-x-3">
        {product.discount_price!=0 && (
          <span className=" top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Sale
          </span>
        )}
        <span className="sm-semibold">{finalPrice} EGP</span>
        {discount_price && (
          <span className="text-gray-600 line-through">{price} EGP</span>
        )}
      </p>
      

      
      <span className={`mx-4 my-4 ${product.stock_quantity <= 0 ? 'text-sm text-red-600 bold' : 'hidden'}`}>
        Out of Stock
      </span>
 

      {isAdmin && (
        <div className="flex-center gap-2">
          <button
            onClick={() => onEdit(id)}
            className="bg-gray-500 text-white w-[80px] text-center cursor-pointer rounded-xs px-3 py-2 mx-2 hover:bg-gray-600 transition"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(id)}
            className="bg-red-600 text-white w-[80px] text-center cursor-pointer rounded-xs px-3 py-2 hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
</div>
  );
};



export default ProductCard;