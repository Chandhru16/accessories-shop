import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  return (
    <div className="success-page">
      <div className="success-card">
        <svg className="tick-svg" viewBox="0 0 100 100">
          <circle className="tick-circle" cx="50" cy="50" r="45" />
          <path className="tick-check" d="M27 50 L43 66 L75 34" />
        </svg>
        <h1>Order Confirmed!</h1>
        <p>Your order has been placed successfully.</p>
        {orderId && <p className="order-id">Order ID: {orderId}</p>}
        <p className="sms-note">
          You can track updates on this order anytime from the bell icon on the home page.
        </p>
        <button onClick={() => navigate("/customer/home")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
