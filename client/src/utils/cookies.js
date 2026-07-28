import Cookies from "js-cookie";

// Centralized cookie helpers so token/user logic isn't scattered everywhere.

export const setCustomerAuth = (token, customer) => {
  Cookies.set("customer_token", token, { expires: 7 });
  Cookies.set("customer_info", JSON.stringify(customer), { expires: 7 });
};

export const getCustomerToken = () => Cookies.get("customer_token");

export const getCustomerInfo = () => {
  const data = Cookies.get("customer_info");
  return data ? JSON.parse(data) : null;
};

export const clearCustomerAuth = () => {
  Cookies.remove("customer_token");
  Cookies.remove("customer_info");
};

export const setOwnerAuth = (token) => {
  Cookies.set("owner_token", token, { expires: 1 });
};

export const getOwnerToken = () => Cookies.get("owner_token");

export const clearOwnerAuth = () => {
  Cookies.remove("owner_token");
};

// ---- Saved delivery addresses (checkout address book) ----
// Stored as a list, most recently used first, so the newest one is the
// default pre-selected choice at checkout — like a typical e-commerce site.

export const getSavedAddresses = () => {
  const data = Cookies.get("saved_addresses");
  return data ? JSON.parse(data) : [];
};

export const saveAddress = (address) => {
  const addresses = getSavedAddresses();
  // Avoid storing an exact duplicate twice.
  const isDuplicate = addresses.some(
    (a) =>
      a.mobileNumber === address.mobileNumber &&
      a.addressDetails === address.addressDetails &&
      a.pincode === address.pincode
  );
  const updated = isDuplicate
    ? addresses
    : [address, ...addresses]; // newest first
  Cookies.set("saved_addresses", JSON.stringify(updated), { expires: 365 });
  return updated;
};

export const deleteAddress = (index) => {
  const addresses = getSavedAddresses();
  const updated = addresses.filter((_, i) => i !== index);
  Cookies.set("saved_addresses", JSON.stringify(updated), { expires: 365 });
  return updated;
};
