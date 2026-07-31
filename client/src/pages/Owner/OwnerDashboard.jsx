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
  category: "",
  subcategory: "",
  stock: "",
  imgUrls: ["", "", ""],
};

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("orders"); // "orders" | "products"
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(emptyProductForm);

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

  useEffect(() => {
    loadOrders();
    loadProducts();
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
      stock: Number(editForm.stock),
      imgUrls: editForm.imgUrls.filter(Boolean),
    });
    closeEditModal();
    loadProducts();
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={10} className="empty-cell">
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
    </div>
  );
};

export default OwnerDashboard;
