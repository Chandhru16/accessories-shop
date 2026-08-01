import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const emptyForm = { userName: "", mobileNumber: "", addressDetails: "", pincode: "" };

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, totalWithDelivery, clearCart } = useCart();
  const { loginCustomer } = useAuth();

  const [addresses, setAddresses] = useState(getSavedAddresses());
  const [selectedIndex, setSelectedIndex] = useState(0); // most recent = default
  const [showAddForm, setShowAddForm] = useState(addresses.length === 0);
  const [editingIndex, setEditingIndex] = useState(null); // null = adding new, number = editing that index
  const [form, setForm] = useState(emptyForm);

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

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
    setForm(addresses[index]);
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

  const handlePlaceOrder = async () => {
    const selectedAddress = addresses[selectedIndex];
    if (!selectedAddress) {
      setError("Please select or add a delivery address.");
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
        totalAmount: totalWithDelivery,
      };
      const { data } = await api.post("/orders", payload);
      addNotification({
        orderId: data.orderId,
        products: items.map(({ product, qty }) => ({ name: product.name, qty })),
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

      {error && <p className="checkout-error">{error}</p>}

      <button
        className="place-order-btn"
        onClick={handlePlaceOrder}
        disabled={placing || showAddForm}
      >
        {placing ? "Placing Order..." : `Place Order — ₹${totalWithDelivery}`}
      </button>
    </div>
  );
};

export default Checkout;
