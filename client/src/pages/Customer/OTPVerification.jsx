import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import "./CustomerAuth.css";

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginCustomer } = useAuth();
  const details = location.state;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If the page is opened directly (no state), send back to login.
  if (!details) {
    navigate("/customer/login");
    return null;
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", {
        requestId: details.requestId,
        mobileNumber: details.mobileNumber,
        otp,
        userName: details.userName,
        addressDetails: details.addressDetails,
        pincode: details.pincode,
      });
      // data => { token, customer }
      loginCustomer(data.token, data.customer);
      navigate("/customer/home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleVerifyOTP}>
        <h1>OTP Verification</h1>
        <p>Enter the OTP sent to {details.mobileNumber}</p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default OTPVerification;
