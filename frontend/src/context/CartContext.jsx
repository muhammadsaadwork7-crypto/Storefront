import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axiosClient from "@/api/axiosClient";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axiosClient.get(`/cart/${user.id}`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error("Please log in to add items to your cart");
    }
    await axiosClient.post("/cart", { product_id: product.id, quantity });
    await refreshCart();
    setCartOpen(true);
  };

  const updateQuantity = async (cartItemId, quantity) => {
    await axiosClient.put(`/cart/${cartItemId}`, { quantity });
    await refreshCart();
  };

  const removeFromCart = async (cartItemId) => {
    await axiosClient.delete(`/cart/${cartItemId}`);
    await refreshCart();
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    await axiosClient.delete(`/cart/user/${user.id}`);
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity * Number(item.price), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        cartOpen,
        setCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
