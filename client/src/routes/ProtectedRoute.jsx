import { Navigate } from "react-router-dom";
import { getCustomerToken, getOwnerToken } from "../utils/cookies";

// type: "customer" | "owner"
const ProtectedRoute = ({ type, children }) => {
  const token = type === "owner" ? getOwnerToken() : getCustomerToken();
  const redirectTo = type === "owner" ? "/owner/login" : "/customer/login";

  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
};

export default ProtectedRoute;
