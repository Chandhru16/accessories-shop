import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./ShopHeader.css";

// Address used both for the map link and the line shown under the shop name.
const SHOP_ADDRESS = "182, Municipal Office Road, Virudhunagar (Near Theppam)";
const SHOP_LOCATION_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  SHOP_ADDRESS
)}`;

const ShopHeader = () => {
  return (
    <div className="shop-header">
      <div className="shop-header-inner">
        <div className="shop-brand">
          <img src="/shop-logo.png" alt="Golden Plaza logo" className="shop-logo" />
          <div>
            <h1 className="shop-name">Golden Plaza</h1>
            <p className="shop-tagline">Premium Gift Shop</p>
            <p className="shop-address">{SHOP_ADDRESS}</p>
          </div>
        </div>

        <div className="shop-contact">
          <a href="tel:8667244160" className="shop-contact-item">
            <FaPhoneAlt />
            <span>8667244160</span>
          </a>
          <a href="tel:9787006885" className="shop-contact-item">
            <FaPhoneAlt />
            <span>9787006885</span>
          </a>
          <a href="mailto:goldenplaza062@gmail.com" className="shop-contact-item">
            <FaEnvelope />
            <span>goldenplaza062@gmail.com</span>
          </a>
          <a
            href={SHOP_LOCATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shop-contact-item"
          >
            <FaMapMarkerAlt />
            <span>Find our store</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
