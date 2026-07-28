import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import LandingPage from "./pages/Landing/LandingPage";
import CustomerHome from "./pages/Customer/CustomerHome";
import Checkout from "./pages/Customer/Checkout";
import OrderSuccess from "./pages/Customer/OrderSuccess";
import OwnerLogin from "./pages/Owner/OwnerLogin";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Customer flow — browsing is open, no login gate.
                Identity/address is only collected at checkout. */}
            <Route path="/customer/home" element={<CustomerHome />} />
            <Route path="/customer/checkout" element={<Checkout />} />
            <Route path="/customer/order-success" element={<OrderSuccess />} />

            {/* Owner flow */}
            <Route path="/owner/login" element={<OwnerLogin />} />
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute type="owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
