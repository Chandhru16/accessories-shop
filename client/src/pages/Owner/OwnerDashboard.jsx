import { useEffect, useState } from "react";
import { FaTrash, FaTimesCircle, FaBan, FaTruck, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import { clearOwnerAuth } from "../../utils/cookies";
import CATEGORY_TREE from "../../data/categories";
import "./OwnerDashboard.css";

const emptyProductForm = {
  name: "",
  description: "",
  price: "",
  mrp: "",
  category: "",
  subcategory: "",
  stock: "",
  imgUrls: ["", "", ""],
};

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("orders"); // "orders" | "products" | "promotions"
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(emptyProductForm);

  // Promotions (banner carousel) state
  const [banners, setBanners] = useState([]);
  const [newBanner, setNewBanner] = useState({ imageUrl: "", linkUrl: "" });
  const [editBanner, setEditBanner] = useState(null); // banner being edited, or null
  const [editBannerForm, setEditBannerForm] = useState({ imageUrl: "", linkUrl: "" });

  // Delivered modal state
  const [deliverModalOrder, setDeliverModalOrder] = useState(null);
  const [deliverForm, setDeliverForm] = useState({
    courierCompany: "",
    trackingId: "",
    expectedDeliveryDate: "",
  });

  // Edit product modal state
  const [editProduct, setEditProduct] = useState(null); // the product being edited, or null
  const [editForm, setEditForm] = useState(emptyProductForm);

  const loadOrders = () => {
    api
      .get("/owner/orders")
      .then(({ data }) => setOrders(data))
      .catch(() => {});
  };

  const loadProducts = () => {
    api
      .get("/products")
      .then(({ data }) => setProducts(data))
      .catch(() => {});
  };

  const loadBanners = () => {
    api
      .get("/banners")
      .then(({ data }) => setBanners(data))
      .catch(() => {});
  };

  useEffect(() => {
    loadOrders();
    loadProducts();
    loadBanners();
  }, []);

  const handleLogout = () => {
    clearOwnerAuth();
    navigate("/owner/login");
  };

  // ---- Order actions ----
  const handleNoStock = async (orderId) => {
    if (!window.confirm("Mark this order as out of stock? The customer will be notified.")) return;
    await api.patch(`/owner/orders/${orderId}/status`, { status: "NoStock" });
    loadOrders();
  };

  const handleNotAbleToDeliver = async (orderId) => {
    if (!window.confirm("Mark this order as not deliverable? The customer will be notified.")) return;
    await api.patch(`/owner/orders/${orderId}/status`, {
      status: "NotAbleToDeliver",
    });
    loadOrders();
  };

  const handleVerifyPayment = async (orderId) => {
    if (!window.confirm("Confirm this UPI payment was received before marking it verified?"))
      return;
    await api.patch(`/owner/orders/${orderId}/verify-payment`);
    loadOrders();
  };

  const handleDeleteOrder = async (orderId) => {
    if (
      !window.confirm(
        "Permanently delete this order from the database? This cannot be undone."
      )
    )
      return;
    await api.delete(`/owner/orders/${orderId}`);
    loadOrders();
  };

  const openDeliverModal = (order) => {
    setDeliverModalOrder(order);
    setDeliverForm({ courierCompany: "", trackingId: "", expectedDeliveryDate: "" });
  };

  const closeDeliverModal = () => setDeliverModalOrder(null);

  const submitDelivered = async (e) => {
    e.preventDefault();
    if (!deliverForm.courierCompany || !deliverForm.trackingId || !deliverForm.expectedDeliveryDate) {
      return;
    }
    await api.patch(`/owner/orders/${deliverModalOrder._id}/status`, {
      status: "Delivered",
      ...deliverForm,
    });
    closeDeliverModal();
    loadOrders();
  };

  // ---- Product actions ----
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/owner/products/${productId}`);
    loadProducts();
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.category || !newProduct.subcategory) {
      alert("Please choose both a category and a subcategory.");
      return;
    }
    await api.post("/owner/products", {
      ...newProduct,
      price: Number(newProduct.price),
      mrp: newProduct.mrp ? Number(newProduct.mrp) : null,
      stock: Number(newProduct.stock),
      imgUrls: newProduct.imgUrls.filter(Boolean),
    });
    setNewProduct(emptyProductForm);
    loadProducts();
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      mrp: product.mrp ? String(product.mrp) : "",
      category: product.category || "",
      subcategory: product.subcategory || "",
      stock: String(product.stock ?? ""),
      imgUrls: [
        product.imgUrls?.[0] || "",
        product.imgUrls?.[1] || "",
        product.imgUrls?.[2] || "",
      ],
    });
  };

  const closeEditModal = () => setEditProduct(null);

  const submitEditProduct = async (e) => {
    e.preventDefault();
    if (!editForm.category || !editForm.subcategory) {
      alert("Please choose both a category and a subcategory.");
      return;
    }
    await api.put(`/owner/products/${editProduct._id}`, {
      ...editForm,
      price: Number(editForm.price),
      mrp: editForm.mrp ? Number(editForm.mrp) : null,
      stock: Number(editForm.stock),
      imgUrls: editForm.imgUrls.filter(Boolean),
    });
    closeEditModal();
    loadProducts();
  };

  // ---- Promotion banner actions ----
  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (banners.length >= 20) {
      alert("You've reached the maximum of 20 promotion banners.");
      return;
    }
    if (!newBanner.imageUrl) return;
    try {
      await api.post("/owner/banners", newBanner);
      setNewBanner({ imageUrl: "", linkUrl: "" });
      loadBanners();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add banner.");
    }
  };

  const openEditBannerModal = (banner) => {
    setEditBanner(banner);
    setEditBannerForm({ imageUrl: banner.imageUrl, linkUrl: banner.linkUrl || "" });
  };

  const closeEditBannerModal = () => setEditBanner(null);

  const submitEditBanner = async (e) => {
    e.preventDefault();
    await api.put(`/owner/banners/${editBanner._id}`, editBannerForm);
    closeEditBannerModal();
    loadBanners();
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm("Delete this promotion banner?")) return;
    await api.delete(`/owner/banners/${bannerId}`);
    loadBanners();
  };

  return (
    <div className="owner-dashboard">
      <header className="owner-header">
        <h1>Owner Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="owner-tabs">
        <button
          className={tab === "orders" ? "active" : ""}
          onClick={() => setTab("orders")}
        >
          Orders
        </button>
        <button
          className={tab === "products" ? "active" : ""}
          onClick={() => setTab("products")}
        >
          Products
        </button>
        <button
          className={tab === "promotions" ? "active" : ""}
          onClick={() => setTab("promotions")}
        >
          Promotions
        </button>
      </div>

      {tab === "orders" && (
        <div className="orders-table-wrap">
          <button className="refresh-orders-btn" onClick={loadOrders}>
            Refresh Orders
          </button>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Pincode</th>
                <th>Contact Number</th>
                <th>Ordered Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={11} className="empty-cell">
                    No orders yet.
                  </td>
                </tr>
              )}
              {orders.map((order) =>
                order.products.map((p, idx) => (
                  <tr key={`${order._id}-${idx}`}>
                    <td>{p.name}</td>
                    <td>₹{p.price}</td>
                    <td>{p.qty}</td>
                    <td>{order.customerId?.userName || "-"}</td>
                    <td>{order.addressDetails}</td>
                    <td>{order.pincode || "-"}</td>
                    <td>{order.customerId?.mobileNumber || "-"}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    {idx === 0 ? (
                      <td rowSpan={order.products.length}>
                        {order.paymentMethod === "UPI" ? (
                          <div className="payment-cell">
                            <span className={`payment-badge ${order.paymentStatus}`}>
                              UPI · {order.paymentStatus}
                            </span>
                            <span className="upi-ref-text">
                              Ref: {order.upiTransactionRef || "-"}
                            </span>
                            {order.paymentStatus === "Pending" && (
                              <button
                                className="verify-payment-btn"
                                onClick={() => handleVerifyPayment(order._id)}
                              >
                                Verify Payment
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="payment-badge COD">COD</span>
                        )}
                      </td>
                    ) : null}
                    {idx === 0 ? (
                      <td rowSpan={order.products.length} className="actions-cell">
                        <button
                          className="action-btn nostock"
                          onClick={() => handleNoStock(order._id)}
                        >
                          <FaBan /> No Stock
                        </button>
                        <button
                          className="action-btn notdeliver"
                          onClick={() => handleNotAbleToDeliver(order._id)}
                        >
                          <FaTimesCircle /> Not Deliverable
                        </button>
                        <button
                          className="action-btn delivered"
                          onClick={() => openDeliverModal(order)}
                        >
                          <FaTruck /> Delivered
                        </button>
                        <button
                          className="action-btn delete-order"
                          onClick={() => handleDeleteOrder(order._id)}
                        >
                          <FaTrash /> Delete Order
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "products" && (
        <div className="products-section">
          <form className="add-product-form" onSubmit={handleAddProduct}>
            <h3>Add New Product</h3>
            <input
              placeholder="Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
            <input
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              required
            />

            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value, subcategory: "" })
              }
              required
            >
              <option value="">Select Category</option>
              {CATEGORY_TREE.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={newProduct.subcategory}
              onChange={(e) =>
                setNewProduct({ ...newProduct, subcategory: e.target.value })
              }
              disabled={!newProduct.category}
              required
            >
              <option value="">
                {newProduct.category ? "Select Subcategory" : "Select category first"}
              </option>
              {(
                CATEGORY_TREE.find((c) => c.name === newProduct.category)?.subcategories || []
              ).map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="MRP (optional — shown crossed out if higher than Price)"
              value={newProduct.mrp}
              onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
            />
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              required
            />
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                placeholder={`Image URL ${i + 1}`}
                value={newProduct.imgUrls[i]}
                onChange={(e) => {
                  const imgUrls = [...newProduct.imgUrls];
                  imgUrls[i] = e.target.value;
                  setNewProduct({ ...newProduct, imgUrls });
                }}
              />
            ))}
            <button type="submit">Add Product</button>
          </form>

          <div className="product-list">
            {products.map((p) => (
              <div className="product-row" key={p._id}>
                <img src={p.imgUrls?.[0]} alt={p.name} />
                <div className="product-row-info">
                  <h4>{p.name}</h4>
                  <p>₹{p.price} · Stock: {p.stock}</p>
                  <p className="product-row-category">
                    {p.category} → {p.subcategory}
                  </p>
                </div>
                <button className="edit-icon" onClick={() => openEditModal(p)}>
                  <FaEdit />
                </button>
                <button
                  className="delete-icon"
                  onClick={() => handleDeleteProduct(p._id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "promotions" && (
        <div className="products-section">
          <form className="add-product-form" onSubmit={handleAddBanner}>
            <h3>Add Promotion Banner</h3>
            <p className="promo-form-hint">
              {banners.length}/20 banners used. These appear as a full-width
              scrolling carousel on the customer home page, right below the
              category bar.
            </p>
            <input
              placeholder="Banner Image URL"
              value={newBanner.imageUrl}
              onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
              required
            />
            <input
              placeholder="Link URL (optional — opens when clicked)"
              value={newBanner.linkUrl}
              onChange={(e) => setNewBanner({ ...newBanner, linkUrl: e.target.value })}
            />
            <button type="submit" disabled={banners.length >= 20}>
              Add Promotion
            </button>
          </form>

          <div className="product-list">
            {banners.length === 0 && (
              <p className="empty-cell">No promotion banners added yet.</p>
            )}
            {banners.map((banner) => (
              <div className="product-row" key={banner._id}>
                <img src={banner.imageUrl} alt="Promotion" />
                <div className="product-row-info">
                  <p className="product-row-category">
                    {banner.linkUrl ? banner.linkUrl : "No link set"}
                  </p>
                </div>
                <button className="edit-icon" onClick={() => openEditBannerModal(banner)}>
                  <FaEdit />
                </button>
                <button
                  className="delete-icon"
                  onClick={() => handleDeleteBanner(banner._id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}


      {deliverModalOrder && (
        <div className="modal-overlay" onClick={closeDeliverModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Mark as Delivered</h2>

            <div className="modal-customer-info">
              <p><strong>{deliverModalOrder.customerId?.userName}</strong></p>
              <p>{deliverModalOrder.addressDetails}</p>
              <p>Pincode: {deliverModalOrder.pincode}</p>
              <p>Contact: {deliverModalOrder.customerId?.mobileNumber}</p>
            </div>

            <form onSubmit={submitDelivered}>
              <label>Courier Company Name</label>
              <input
                placeholder="e.g. Delhivery, Blue Dart"
                value={deliverForm.courierCompany}
                onChange={(e) =>
                  setDeliverForm({ ...deliverForm, courierCompany: e.target.value })
                }
                required
              />

              <label>Courier Tracking ID</label>
              <input
                placeholder="Tracking ID"
                value={deliverForm.trackingId}
                onChange={(e) =>
                  setDeliverForm({ ...deliverForm, trackingId: e.target.value })
                }
                required
              />

              <label>Delivery Expected Date</label>
              <input
                type="date"
                value={deliverForm.expectedDeliveryDate}
                onChange={(e) =>
                  setDeliverForm({ ...deliverForm, expectedDeliveryDate: e.target.value })
                }
                required
              />

              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={closeDeliverModal}>
                  Cancel
                </button>
                <button type="submit" className="modal-confirm">
                  Confirm Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editProduct && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Product</h2>

            <form className="edit-product-form" onSubmit={submitEditProduct}>
              <input
                placeholder="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
              <input
                placeholder="Description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                required
              />

              <select
                value={editForm.category}
                onChange={(e) =>
                  setEditForm({ ...editForm, category: e.target.value, subcategory: "" })
                }
                required
              >
                <option value="">Select Category</option>
                {CATEGORY_TREE.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={editForm.subcategory}
                onChange={(e) =>
                  setEditForm({ ...editForm, subcategory: e.target.value })
                }
                disabled={!editForm.category}
                required
              >
                <option value="">
                  {editForm.category ? "Select Subcategory" : "Select category first"}
                </option>
                {(
                  CATEGORY_TREE.find((c) => c.name === editForm.category)?.subcategories || []
                ).map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Price"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="MRP (optional — shown crossed out if higher than Price)"
                value={editForm.mrp}
                onChange={(e) => setEditForm({ ...editForm, mrp: e.target.value })}
              />
              <input
                type="number"
                placeholder="Stock"
                value={editForm.stock}
                onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                required
              />
              {[0, 1, 2].map((i) => (
                <input
                  key={i}
                  placeholder={`Image URL ${i + 1}`}
                  value={editForm.imgUrls[i]}
                  onChange={(e) => {
                    const imgUrls = [...editForm.imgUrls];
                    imgUrls[i] = e.target.value;
                    setEditForm({ ...editForm, imgUrls });
                  }}
                />
              ))}

              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="modal-confirm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editBanner && (
        <div className="modal-overlay" onClick={closeEditBannerModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Promotion Banner</h2>

            <form onSubmit={submitEditBanner}>
              <label>Banner Image URL</label>
              <input
                value={editBannerForm.imageUrl}
                onChange={(e) =>
                  setEditBannerForm({ ...editBannerForm, imageUrl: e.target.value })
                }
                required
              />

              <label>Link URL (optional)</label>
              <input
                value={editBannerForm.linkUrl}
                onChange={(e) =>
                  setEditBannerForm({ ...editBannerForm, linkUrl: e.target.value })
                }
              />

              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={closeEditBannerModal}>
                  Cancel
                </button>
                <button type="submit" className="modal-confirm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
