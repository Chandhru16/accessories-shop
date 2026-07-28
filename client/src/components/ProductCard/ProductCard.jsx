import { useState } from "react";
import { useCart } from "../../context/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [imgIndex, setImgIndex] = useState(0);

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
        <div className="product-footer">
          <span className="product-price">₹{product.price}</span>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
