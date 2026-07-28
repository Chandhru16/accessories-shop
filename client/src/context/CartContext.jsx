import { createContext, useContext, useState, useMemo, useEffect } from "react";

const CartContext = createContext(null);

export const DELIVERY_CHARGE = 49;
const CART_STORAGE_KEY = "cart_items";

const loadStoredCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  // Cart now persists across refreshes/tabs via localStorage.
  const [items, setItems] = useState(loadStoredCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const decreaseQty = (productId) => {
    setItems((prev) =>
      prev
        .map((i) => (i.product._id === productId ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.product._id !== productId));
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.qty, 0),
    [items]
  );

  const totalWithDelivery = items.length > 0 ? subtotal + DELIVERY_CHARGE : 0;
  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        decreaseQty,
        removeFromCart,
        clearCart,
        subtotal,
        totalWithDelivery,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
