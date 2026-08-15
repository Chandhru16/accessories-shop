import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useCart, DELIVERY_CHARGE } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import {
  getSavedAddresses,
  saveAddress,
  deleteAddress,
  updateAddressAt,
} from "../../utils/cookies";
import { addNotification } from "../../utils/notifications";
import api from "../../api/axiosInstance";
import "./Checkout.css";

const emptyForm = {
  userName: "",
  mobileNumber: "",
  email: "",
  addressDetails: "",
  pincode: "",
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, totalWithDelivery, clearCart } = useCart();
  const { loginCustomer } = useAuth();

  const [addresses, setAddresses] = useState(getSavedAddresses());
  const [selectedIndex, setSelectedIndex] = useState(0); // most recent = default
  const [showAddForm, setShowAddForm] = useState(addresses.length === 0);
  const [editingIndex, setEditingIndex] = useState(null); // null = adding new, number = editing that index
  const [form, setForm] = useState(emptyForm);

  const [paymentMethod, setPaymentMethod] = useState("COD"); // "COD" | "UPI"
  const [upiInfo, setUpiInfo] = useState({ upiId: "", payeeName: "Golden Plaza" });
  const [upiTransactionRef, setUpiTransactionRef] = useState("");

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/settings/upi")
      .then(({ data }) => setUpiInfo(data))
      .catch(() => {});
  }, []);

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <p>Your cart is empty.</p>
        <button onClick={() => navigate("/customer/home")}>Back to Shop</button>
      </div>
    );
  }

  const validate = () => {
    if (form.userName.trim().length < 2) return "Enter a valid name.";
    if (!/^[6-9]\d{9}$/.test(form.mobileNumber))
      return "Enter a valid 10-digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Enter a valid email address.";
    if (form.addressDetails.trim().length < 5) return "Enter your address.";
    if (!/^\d{6}$/.test(form.pincode)) return "Enter a valid 6-digit pincode.";
    return "";
  };

  const handleOpenAddForm = () => {
    setEditingIndex(null);
    setForm(emptyForm);
    setShowAddForm(true);
  };

  const handleEditAddress = (index) => {
    setEditingIndex(index);
    setForm({ email: "", ...addresses[index] });
    setShowAddForm(true);
  };

  const handleDeleteAddress = (index) => {
    if (!window.confirm("Delete this address?")) return;
    const updated = deleteAddress(index);
    setAddresses(updated);
    if (selectedIndex >= updated.length) {
      setSelectedIndex(0);
    }
    if (updated.length === 0) {
      handleOpenAddForm();
    }
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");

    if (editingIndex !== null) {
      const updated = updateAddressAt(editingIndex, form);
      setAddresses(updated);
      setSelectedIndex(editingIndex);
    } else {
      const updated = saveAddress(form);
      setAddresses(updated);
      setSelectedIndex(0); // the newly added one sits first
    }
    setShowAddForm(false);
    setEditingIndex(null);
    setForm(emptyForm);
  };

  const upiDeepLink = upiInfo.upiId
    ? `upi://pay?pa=${encodeURIComponent(upiInfo.upiId)}&pn=${encodeURIComponent(
        upiInfo.payeeName
      )}&am=${totalWithDelivery}&cu=INR&tn=${encodeURIComponent("Golden Plaza order")}`
    : "";

  const handlePlaceOrder = async () => {
    const selectedAddress = addresses[selectedIndex];
    if (!selectedAddress) {
      setError("Please select or add a delivery address.");
      return;
    }
    if (!selectedAddress.email) {
      setError("This saved address is missing an email — edit it to add one.");
      return;
    }
    if (paymentMethod === "UPI" && !upiTransactionRef.trim()) {
      setError("Enter the UPI transaction reference number after paying.");
      return;
    }

    setPlacing(true);
    setError("");
    try {
      const { data: loginData } = await api.post("/auth/login", selectedAddress);
      loginCustomer(loginData.token, loginData.customer);

      const payload = {
        products: items.map(({ product, qty }) => ({
          productId: product._id,
          name: product.name,
          price: product.price,
          qty,
        })),
        addressDetails: selectedAddress.addressDetails,
        pincode: selectedAddress.pincode,
        email: selectedAddress.email,
        totalAmount: totalWithDelivery,
        paymentMethod,
        upiTransactionRef: paymentMethod === "UPI" ? upiTransactionRef.trim() : null,
      };
      const { data } = await api.post("/orders", payload);
      addNotification({
        orderId: data.orderId,
        products: items.map(({ product, qty }) => ({ name: product.name, qty })),
        paymentMethod,
      });
      clearCart();
      navigate("/customer/order-success", { state: { orderId: data.orderId } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-section">
        <h3>Delivery Address</h3>

        {addresses.length > 0 && (
          <div className="address-list">
            {addresses.map((addr, i) => (
              <label
                key={i}
                className={`address-card ${selectedIndex === i ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedIndex === i}
                  onChange={() => {
                    setSelectedIndex(i);
                    setShowAddForm(false);
                  }}
                />
                <div className="address-card-body">
                  <p className="address-name">{addr.userName}</p>
                  <p>{addr.addressDetails}</p>
                  <p>Pincode: {addr.pincode}</p>
                  <p>Mobile: {addr.mobileNumber}</p>
                  <p>Email: {addr.email || "— not set, please edit —"}</p>
                </div>
                <div className="address-card-actions">
                  <button
                    type="button"
                    className="edit-address-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditAddress(i);
                    }}
                  >
                    <FaEdit size={13} />
                  </button>
                  <button
                    type="button"
                    className="delete-address-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteAddress(i);
                    }}
                  >
                    <FaTrash size={13} />
                  </button>
                </div>
              </label>
            ))}
          </div>
        )}

        {!showAddForm && (
          <button className="add-address-btn" onClick={handleOpenAddForm}>
            + Add Another Address
          </button>
        )}

        {showAddForm && (
          <form className="address-form" onSubmit={handleSaveAddress}>
            <input
              placeholder="Full Name"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              maxLength={10}
              value={form.mobileNumber}
              onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <textarea
              placeholder="Address (House no, Street, Area, City)"
              rows={3}
              value={form.addressDetails}
              onChange={(e) => setForm({ ...form, addressDetails: e.target.value })}
            />
            <input
              placeholder="Pincode"
              maxLength={6}
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            />
            <div className="address-form-actions">
              {addresses.length > 0 && (
                <button
                  type="button"
                  className="cancel-address-btn"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingIndex(null);
                  }}
                >
                  Cancel
                </button>
              )}
              <button type="submit" className="save-address-btn">
                {editingIndex !== null ? "Update Address" : "Save Address"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="checkout-section">
        <h3>Order Summary</h3>
        {items.map(({ product, qty }) => (
          <div className="checkout-row" key={product._id}>
            <span>
              {product.name} × {qty}
            </span>
            <span>₹{product.price * qty}</span>
          </div>
        ))}
        <div className="checkout-row">
          <span>Delivery Charge</span>
          <span>₹{DELIVERY_CHARGE}</span>
        </div>
        <div className="checkout-row total">
          <span>Total</span>
          <span>₹{totalWithDelivery}</span>
        </div>
      </div>

      <div className="checkout-section">
        <h3>Payment Method</h3>
        <div className="payment-options">
          <label className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}>
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery
          </label>
          <label className={`payment-option ${paymentMethod === "UPI" ? "selected" : ""}`}>
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "UPI"}
              onChange={() => setPaymentMethod("UPI")}
            />
            Pay via UPI
          </label>
        </div>

        {paymentMethod === "UPI" && (
          <div className="upi-payment-box">
            {upiInfo.upiId ? (
              <>
                <p className="upi-instructions">
                  Scan with any UPI app (GPay, PhonePe, Paytm) to pay{" "}
                  <strong>₹{totalWithDelivery}</strong>, then enter the transaction
                  reference number below. Your order will be marked "Payment
                  Pending" until the shop verifies it.
                </p>
                <div className="upi-qr-wrap">
                  <QRCodeSVG value={upiDeepLink} size={180} />
                </div>
                <p className="upi-id-text">UPI ID: {upiInfo.upiId}</p>
                <input
                  placeholder="UPI Transaction Reference / UTR Number"
                  value={upiTransactionRef}
                  onChange={(e) => setUpiTransactionRef(e.target.value)}
                  required
                />
              </>
            ) : (
              <p className="upi-instructions">
                UPI payment isn't set up yet — please choose Cash on Delivery.
              </p>
            )}
          </div>
        )}
      </div>

      {error && <p className="checkout-error">{error}</p>}

      <button
        className="place-order-btn"
        onClick={handlePlaceOrder}
        disabled={placing || showAddForm || (paymentMethod === "UPI" && !upiInfo.upiId)}
      >
        {placing ? "Placing Order..." : `Place Order — ₹${totalWithDelivery}`}
      </button>
    </div>
  );
};

export default Checkout;
