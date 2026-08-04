import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [imgIndex, setImgIndex] = useState(0);

  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleOrderNow = () => {
    addToCart(product);
    navigate("/customer/checkout");
  };

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img src={product.imgUrls[imgIndex]} alt={product.name} />
        <div className="image-dots">
          {product.imgUrls.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === imgIndex ? "active" : ""}`}
              onClick={() => setImgIndex(i)}
            />
          ))}
        </div>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-price-row">
          <span className="product-price">₹{product.price}</span>
          {hasDiscount && (
            <>
              <span className="product-mrp">₹{product.mrp}</span>
              <span className="product-discount">{discountPercent}% off</span>
            </>
          )}
        </div>

        <div className="product-footer">
          <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
          <button className="order-now-btn" onClick={handleOrderNow}>
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
