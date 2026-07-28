import axios from "axios";
import { getCustomerToken, getOwnerToken } from "../utils/cookies";

// Change this once your backend is deployed (Render/Railway/etc).
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach whichever token exists (customer or owner) automatically.
api.interceptors.request.use((config) => {
  const customerToken = getCustomerToken();
  const ownerToken = getOwnerToken();
  if (config.url?.startsWith("/owner") && ownerToken) {
    config.headers.Authorization = `Bearer ${ownerToken}`;
  } else if (customerToken) {
    config.headers.Authorization = `Bearer ${customerToken}`;
  }
  return config;
});

export default api;
