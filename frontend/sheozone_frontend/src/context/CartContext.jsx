import { createContext, useContext, useState, useEffect } from "react";
import { getCartItems } from "../api";
import PropTypes from "prop-types";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  //   const fetchCartItems = async () => {
  //     const items = await getCartItems();
  //     setCartCount(items.length || 0);
  //   };

  const fetchCartItems = async () => {
    try {
      const items = await getCartItems();
      setCartCount(Array.isArray(items) ? items.length : 0);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => useContext(CartContext);
