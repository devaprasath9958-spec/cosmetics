// @refresh reset
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { fetchProducts, fetchReviews, fetchAllOrders, fetchCollections } from "../services/api.js";

const AdminDataContext = createContext(null);

const parseColors = (colors) => {
  if (!colors) return ["#C9A769", "#8B3A4B"];
  return typeof colors === "string" ? JSON.parse(colors) : colors;
};

export function AdminDataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [offers, setOffers] = useState([]);
  const [collections, setCollections] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const [pData, revData, ordData, colData] = await Promise.all([
        fetchProducts(),
        fetchReviews(),
        fetchAllOrders(),
        fetchCollections(),
      ]);

      const [
        catRes, brandRes, offerRes, blogRes,
        profilesRes, newsletterRes, messagesRes,
      ] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("brands").select("*").order("name"),
        supabase.from("offers").select("*"),
        supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      ]);

      setProducts(pData ?? []);
      setReviews(revData ?? []);
      setOrders(ordData ?? []);
      setCollections(colData ?? []);
      setCategories(catRes.data ?? []);
      setBrands(brandRes.data ?? []);
      setOffers(offerRes.data ?? []);
      setBlogPosts(blogRes.data ?? []);
      setCustomers(profilesRes.data ?? []);
      setNewsletterSubscribers(newsletterRes.data ?? []);
      setContactMessages(messagesRes.data ?? []);
    } catch (e) {
      console.error("AdminDataContext loadData error:", e);
    }
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener("orders-updated", loadData);
    window.addEventListener("admin-data-updated", loadData);
    return () => {
      window.removeEventListener("orders-updated", loadData);
      window.removeEventListener("admin-data-updated", loadData);
    };
  }, [loadData]);

  // ─── Products ────────────────────────────────────────────
  const addProduct = async (product) => {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();
    if (!error && data) {
      setProducts((prev) => [
        ...prev,
        { ...data, colors: parseColors(data.colors), oldPrice: data.old_price ?? data.oldPrice },
      ]);
    } else if (error) {
      console.error("addProduct error:", error);
    }
  };

  const updateProduct = async (id, updates) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    const { error } = await supabase.from("products").update(updates).eq("id", id);
    if (error) console.error("updateProduct error:", error);
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) console.error("deleteProduct error:", error);
  };

  // ─── Categories ──────────────────────────────────────────
  const addCategory = async (category) => {
    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();
    if (!error && data) setCategories((prev) => [...prev, data]);
    else if (error) console.error("addCategory error:", error);
  };

  const updateCategory = async (id, updates) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    const { error } = await supabase.from("categories").update(updates).eq("id", id);
    if (error) console.error("updateCategory error:", error);
  };

  const deleteCategory = async (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) console.error("deleteCategory error:", error);
  };

  // ─── Brands ──────────────────────────────────────────────
  const addBrand = async (brand) => {
    const { data, error } = await supabase
      .from("brands")
      .insert(brand)
      .select()
      .single();
    if (!error && data) setBrands((prev) => [...prev, data]);
    else if (error) console.error("addBrand error:", error);
  };

  const updateBrand = async (id, updates) => {
    setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    const { error } = await supabase.from("brands").update(updates).eq("id", id);
    if (error) console.error("updateBrand error:", error);
  };

  const deleteBrand = async (id) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) console.error("deleteBrand error:", error);
  };

  // ─── Offers ──────────────────────────────────────────────
  const addOffer = async (offer) => {
    const { data, error } = await supabase
      .from("offers")
      .insert(offer)
      .select()
      .single();
    if (!error && data) setOffers((prev) => [...prev, data]);
    else if (error) console.error("addOffer error:", error);
  };

  const updateOffer = async (id, updates) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
    const { error } = await supabase.from("offers").update(updates).eq("id", id);
    if (error) console.error("updateOffer error:", error);
  };

  const deleteOffer = async (id) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    const { error } = await supabase.from("offers").delete().eq("id", id);
    if (error) console.error("deleteOffer error:", error);
  };

  // ─── Collections ─────────────────────────────────────────
  const addCollection = async (collection) => {
    const { data, error } = await supabase
      .from("collections")
      .insert(collection)
      .select()
      .single();
    if (!error && data) setCollections((prev) => [...prev, data]);
    else if (error) console.error("addCollection error:", error);
  };

  const updateCollection = async (id, updates) => {
    setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    const { error } = await supabase.from("collections").update(updates).eq("id", id);
    if (error) console.error("updateCollection error:", error);
  };

  const deleteCollection = async (id) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) console.error("deleteCollection error:", error);
  };

  // ─── Blog Posts ──────────────────────────────────────────
  const addBlogPost = async (post) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .insert(post)
      .select()
      .single();
    if (!error && data) setBlogPosts((prev) => [data, ...prev]);
    else if (error) console.error("addBlogPost error:", error);
  };

  const updateBlogPost = async (id, updates) => {
    setBlogPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    const { error } = await supabase.from("blog_posts").update(updates).eq("id", id);
    if (error) console.error("updateBlogPost error:", error);
  };

  const deleteBlogPost = async (id) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) console.error("deleteBlogPost error:", error);
  };

  // ─── Newsletter Subscribers ───────────────────────────────
  const deleteNewsletterSubscriber = async (id) => {
    setNewsletterSubscribers((prev) => prev.filter((s) => s.id !== id));
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) console.error("deleteNewsletterSubscriber error:", error);
  };

  // ─── Orders ──────────────────────────────────────────────
  const updateOrderStatus = async (id, status) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status, statusText: getStatusText(status) } : o))
    );
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) console.error("updateOrderStatus error:", error);
    window.dispatchEvent(new Event("orders-updated"));
  };

  const deleteOrder = async (id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) console.error("deleteOrder error:", error);
    window.dispatchEvent(new Event("orders-updated"));
  };

  // ─── Customers (profiles table) ──────────────────────────
  const updateCustomer = async (id, updates) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    const { error } = await supabase.from("profiles").update(updates).eq("id", id);
    if (error) console.error("updateCustomer error:", error);
  };

  const deleteCustomer = async (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) console.error("deleteCustomer error:", error);
  };

  // ─── Reviews ─────────────────────────────────────────────
  const updateReviewStatus = async (id, status) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
    if (error) console.error("updateReviewStatus error:", error);
  };

  const deleteReview = async (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) console.error("deleteReview error:", error);
  };

  // ─── Computed values ─────────────────────────────────────
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingReviews = reviews.filter((r) => r.status === "Pending").length;

  return (
    <AdminDataContext.Provider
      value={{
        // State
        products, categories, brands, offers, collections,
        blogPosts, newsletterSubscribers, contactMessages,
        customers, reviews, orders,
        // Computed
        totalRevenue, pendingReviews,
        // Products
        addProduct, updateProduct, deleteProduct,
        // Categories
        addCategory, updateCategory, deleteCategory,
        // Brands
        addBrand, updateBrand, deleteBrand,
        // Offers
        addOffer, updateOffer, deleteOffer,
        // Collections
        addCollection, updateCollection, deleteCollection,
        // Blog
        addBlogPost, updateBlogPost, deleteBlogPost,
        // Newsletter
        deleteNewsletterSubscriber,
        // Orders
        updateOrderStatus, deleteOrder,
        // Customers
        updateCustomer, deleteCustomer,
        // Reviews
        updateReviewStatus, deleteReview,
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
