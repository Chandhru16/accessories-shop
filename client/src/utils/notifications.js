// Notifications are tracked per-browser in localStorage, keyed by orderId.
// This is deliberate: a customer might place orders under different saved
// addresses/mobile numbers (different backend "customer" identities), but
// they should still see every order they placed from this browser in one
// place. Each entry also gets refreshed against the backend to pick up
// status changes (No Stock / Not Deliverable / Delivered, and now UPI
// payment verification) made by the owner.
//
// Deleting a notification "dismisses" it rather than erasing it forever —
// if the owner updates that order's status or payment status again after
// it was dismissed, it automatically reappears, since that's new
// information the customer hasn't seen yet.

const STORAGE_KEY = "order_notifications";

export const getAllNotifications = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// What the UI should actually render — dismissed entries are hidden.
export const getNotifications = () => getAllNotifications().filter((n) => !n.dismissed);

const saveNotifications = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

// Called right after an order is placed.
export const addNotification = (order) => {
  const list = getAllNotifications();
  const entry = {
    orderId: order.orderId,
    products: order.products, // [{ name, qty }]
    createdAt: new Date().toISOString(),
    status: "Placed",
    trackingId: null,
    courierCompany: null,
    expectedDeliveryDate: null,
    paymentMethod: order.paymentMethod || "COD",
    paymentStatus: order.paymentMethod === "UPI" ? "Pending" : "NotApplicable",
    dismissed: false,
    dismissedAtStatus: null,
    dismissedAtPaymentStatus: null,
  };
  const updated = [entry, ...list.filter((n) => n.orderId !== order.orderId)];
  saveNotifications(updated);
  return getNotifications();
};

// Merges fresh status data (from GET /api/orders/status/:id) into the
// locally stored entry for that order. If this order was previously
// dismissed but either the delivery status or the payment status has
// changed since then, it un-dismisses automatically so the new update
// isn't missed.
export const mergeNotificationStatus = (orderId, statusData) => {
  const list = getAllNotifications();
  const updated = list.map((n) => {
    if (n.orderId !== orderId) return n;
    const somethingChangedSinceDismiss =
      n.dismissed &&
      (n.dismissedAtStatus !== statusData.status ||
        n.dismissedAtPaymentStatus !== statusData.paymentStatus);
    return {
      ...n,
      status: statusData.status,
      trackingId: statusData.trackingId,
      courierCompany: statusData.courierCompany,
      expectedDeliveryDate: statusData.expectedDeliveryDate,
      paymentMethod: statusData.paymentMethod || n.paymentMethod,
      paymentStatus: statusData.paymentStatus || n.paymentStatus,
      dismissed: somethingChangedSinceDismiss ? false : n.dismissed,
    };
  });
  saveNotifications(updated);
  return getNotifications();
};

// The bin icon — dismisses one notification from view.
export const removeNotification = (orderId) => {
  const list = getAllNotifications().map((n) =>
    n.orderId === orderId
      ? {
          ...n,
          dismissed: true,
          dismissedAtStatus: n.status,
          dismissedAtPaymentStatus: n.paymentStatus,
        }
      : n
  );
  saveNotifications(list);
  return getNotifications();
};
