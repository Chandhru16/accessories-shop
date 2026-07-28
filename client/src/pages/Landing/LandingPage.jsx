import { useNavigate } from "react-router-dom";
import { FaUserTie, FaShoppingBag } from "react-icons/fa";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-content">
        <img src="/shop-logo.png" alt="Golden Plaza logo" className="landing-logo" />
        <h1>Golden Plaza</h1>
        <p className="landing-tagline">Premium Gift Shop</p>
        <p>Choose how you'd like to continue</p>

        <div className="landing-buttons">
          <button
            className="landing-card customer"
            onClick={() => navigate("/customer/home")}
          >
            <FaShoppingBag size={40} />
            <span>Customer Visit</span>
          </button>

          <button
            className="landing-card owner"
            onClick={() => navigate("/owner/login")}
          >
            <FaUserTie size={40} />
            <span>Owner Visit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
