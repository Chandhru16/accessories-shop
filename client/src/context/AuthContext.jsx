import { createContext, useContext, useState } from "react";
import { getCustomerInfo, setCustomerAuth, clearCustomerAuth } from "../utils/cookies";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(getCustomerInfo());

  const loginCustomer = (token, customerData) => {
    setCustomerAuth(token, customerData);
    setCustomer(customerData);
  };

  const logoutCustomer = () => {
    clearCustomerAuth();
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ customer, loginCustomer, logoutCustomer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
