import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { products as defaultProducts } from "../data/products.js";
import { SEED_CUSTOMERS, SEED_ADMIN_REVIEWS } from "../data/adminSeed.js";

const AdminDataContext = createContext(null);

const KEYS = {
  products: "lume-admin-products",
  customers: "lume-admin-customers",
  reviews: "lume-admin-reviews",
  orders: "lume-orders",
};

function load(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return fallback;
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new Event("admin-data-updated"));
}

export function AdminDataProvider({ children }) {
  const [products, setProducts] = useState(() => load(KEYS.products, defaultProducts));
  const [customers, setCustomers] = useState(() => load(KEYS.customers, SEED_CUSTOMERS));
  const [reviews, setReviews] = useState(() => load(KEYS.reviews, SEED_ADMIN_REVIEWS));
  const [orders, setOrders] = useState([]);

  const refreshOrders = useCallback(() => {
    setOrders(load(KEYS.orders, []));
  }, []);

  useEffect(() => {
    refreshOrders();
    window.addEventListener("orders-updated", refreshOrders);
    window.addEventListener("admin-data-updated", refreshOrders);
    return () => {
      window.removeEventListener("orders-updated", refreshOrders);
      window.removeEventListener("admin-data-updated", refreshOrders);
    };
  }, [refreshOrders]);

  useEffect(() => {
    save(KEYS.products, products);
  }, [products]);

  useEffect(() => {
    save(KEYS.customers, customers);
  }, [customers]);

  useEffect(() => {
    save(KEYS.reviews, reviews);
  }, [reviews]);

  const addProduct = (product) => {
    const id = `p${Date.now()}`;
    setProducts((prev) => [...prev, { ...product, id }]);
  };

  const updateProduct = (id, updates) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateOrderStatus = (id, status) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status, statusText: getStatusText(status) } : o
    );
    save(KEYS.orders, updated);
    setOrders(updated);
    window.dispatchEvent(new Event("orders-updated"));
  };

  const deleteOrder = (id) => {
    const updated = orders.filter((o) => o.id !== id);
    save(KEYS.orders, updated);
    setOrders(updated);
    window.dispatchEvent(new Event("orders-updated"));
  };

  const addCustomer = (customer) => {
    const id = `c${Date.now()}`;
    setCustomers((prev) => [...prev, { ...customer, id, orders: 0, spent: 0 }]);
  };

  const updateCustomer = (id, updates) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCustomer = (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const updateReviewStatus = (id, status) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const deleteReview = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingReviews = reviews.filter((r) => r.status === "Pending").length;

  return (
    <AdminDataContext.Provider
      value={{
        products,
        orders,
        customers,
        reviews,
        totalRevenue,
        pendingReviews,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        deleteOrder,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        updateReviewStatus,
        deleteReview,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

function getStatusText(status) {
  const map = {
    Processing: "Dermatological formulas are being verified and boxed.",
    "In Transit": "Parcel is with the local courier for distribution.",
    Delivered: "Delivered to reception. Signature acquired.",
    Cancelled: "Order was cancelled by the customer.",
  };
  return map[status] || "";
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}
