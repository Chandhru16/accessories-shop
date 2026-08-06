import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleOrderNow = () => {
    addToCart(product);
    navigate("/customer/checkout");
  };

  // Updates the active dot as the user swipes/scrolls the image strip.
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(index);
  };

  // Clicking a dot scrolls smoothly to that image.
  const scrollToIndex = (index) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
    setActiveIndex(index);
  };

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <div className="product-image-scroll" ref={scrollRef} onScroll={handleScroll}>
          {product.imgUrls.map((url, i) => (
            <img key={i} src={url} alt={`${product.name} ${i + 1}`} />
          ))}
        </div>
        {product.imgUrls.length > 1 && (
          <div className="image-dots">
            {product.imgUrls.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === activeIndex ? "active" : ""}`}
                onClick={() => scrollToIndex(i)}
              />
            ))}
          </div>
        )}
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
