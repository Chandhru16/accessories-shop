import { FaTimes, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart, DELIVERY_CHARGE } from "../../context/CartContext";
import "./CartDrawer.css";

const CartDrawer = ({ onClose }) => {
  const navigate = useNavigate();
  const {
    items,
    addToCart,
    decreaseQty,
    removeFromCart,
    clearCart,
    subtotal,
    totalWithDelivery,
  } = useCart();

  const handleCheckout = () => {
    onClose();
    navigate("/customer/checkout");
  };

  const handleRemoveAll = () => {
    if (window.confirm("Remove all items from your cart?")) {
      clearCart();
    }
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {items.length > 0 && (
          <button className="remove-all-btn" onClick={handleRemoveAll}>
            <FaTrash size={11} /> Remove All
          </button>
        )}

        {items.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {items.map(({ product, qty }) => (
                <div className="cart-item" key={product._id}>
                  <img src={product.imgUrls[0]} alt={product.name} />
                  <div className="cart-item-info">
                    <h4>{product.name}</h4>
                    <p>₹{product.price}</p>
                    <div className="qty-control">
                      <button onClick={() => decreaseQty(product._id)}>
                        <FaMinus size={10} />
                      </button>
                      <span>{qty}</span>
                      <button onClick={() => addToCart(product)}>
                        <FaPlus size={10} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(product._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charge</span>
                <span>₹{DELIVERY_CHARGE}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{totalWithDelivery}</span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
