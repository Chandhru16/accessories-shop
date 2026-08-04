import { useEffect, useRef, useState } from "react";
import { FaShoppingBag, FaTrash } from "react-icons/fa";
import api from "../../api/axiosInstance";
import {
  getAllNotifications,
  getNotifications,
  mergeNotificationStatus,
  removeNotification,
} from "../../utils/notifications";
import "./NotificationBell.css";

const STATUS_LABEL = {
  Placed: "Order placed — awaiting update",
  NoStock: "Out of stock",
  NotAbleToDeliver: "Unable to deliver",
  Delivered: "Shipped",
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const refreshStatuses = async () => {
    const current = getAllNotifications();
    if (current.length === 0) {
      setNotifications([]);
      return;
    }
    await Promise.all(
      current.map(async (n) => {
        try {
          const { data } = await api.get(`/orders/status/${n.orderId}`);
          mergeNotificationStatus(n.orderId, data);
        } catch {
          // Order might have been deleted server-side — leave the local
          // entry as-is rather than losing the customer's history.
        }
      })
    );
    setNotifications(getNotifications());
  };

  useEffect(() => {
    setNotifications(getNotifications());
    refreshStatuses();
    const interval = setInterval(refreshStatuses, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = (orderId) => {
    setNotifications(removeNotification(orderId));
  };

  return (
    <div className="bell-wrapper" ref={wrapperRef}>
      <button
        className="bell-button"
        onClick={() => {
          setOpen((o) => !o);
          refreshStatuses();
        }}
      >
        <FaShoppingBag size={19} />
        {notifications.length > 0 && (
          <span className="bell-badge">{notifications.length}</span>
        )}
      </button>

      {open && (
        <div className="bell-dropdown">
          <h4>Your Orders</h4>
          {notifications.length === 0 ? (
            <p className="bell-empty">No orders yet.</p>
          ) : (
            <div className="bell-list">
              {notifications.map((n) => (
                <div className="bell-item" key={n.orderId}>
                  <div className="bell-item-top">
                    <span className={`bell-status ${n.status}`}>
                      {STATUS_LABEL[n.status] || n.status}
                    </span>
                    <div className="bell-item-right">
                      <span className="bell-date">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        className="bell-delete-btn"
                        onClick={() => handleDelete(n.orderId)}
                        title="Delete this notification"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="bell-products">
                    {n.products.map((p) => `${p.name} × ${p.qty}`).join(", ")}
                  </p>
                  {n.status === "Delivered" && (
                    <div className="bell-tracking">
                      <p>Courier: {n.courierCompany}</p>
                      <p>Tracking ID: {n.trackingId}</p>
                      {n.expectedDeliveryDate && (
                        <p>
                          Expected:{" "}
                          {new Date(n.expectedDeliveryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
