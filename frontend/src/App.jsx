import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { AdminAuthProvider } from "./contexts/AdminAuthContext.jsx";
import { AdminDataProvider } from "./contexts/AdminDataContext.jsx";
import { ReactLenis } from "@studio-freight/react-lenis";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Trending from "./components/Trending.jsx";
import Categories from "./components/Categories.jsx";
import Products from "./components/Products.jsx";
import Reviews from "./components/Reviews.jsx";
import Brands from "./components/Brands.jsx";
import Offers from "./components/Offers.jsx";
import Newsletter from "./components/Newsletter.jsx";
import Footer from "./components/Footer.jsx";
import Collections from "./components/Collections.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import Orders from "./components/Orders.jsx";
import Cart from "./components/Cart.jsx";
import Profile from "./components/Profile.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import Wishlist from "./components/Wishlist.jsx";
import ScrollToTop from "./components/ui/ScrollToTop.jsx";
import WhatsAppButton from "./components/ui/WhatsAppButton.jsx";
import InstagramGallery from "./components/InstagramGallery.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Signup from "./components/Signup.jsx";
import Checkout from "./components/Checkout.jsx";
import OrderTracking from "./components/OrderTracking.jsx";
import FAQ from "./components/FAQ.jsx";
import Blog from "./components/Blog.jsx";
import TestimonialsPage from "./components/TestimonialsPage.jsx";
import NotFound from "./components/NotFound.jsx";
import CustomBeauty from "./components/CustomBeauty.jsx";
import AdminLogin from "./components/admin/AdminLogin.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import AdminProducts from "./components/admin/AdminProducts.jsx";
import AdminOrders from "./components/admin/AdminOrders.jsx";
import AdminPayments from "./components/admin/AdminPayments.jsx";
import AdminCustomers from "./components/admin/AdminCustomers.jsx";
import AdminReviews from "./components/admin/AdminReviews.jsx";
import AdminCategories from "./components/admin/AdminCategories.jsx";
import AdminBrands from "./components/admin/AdminBrands.jsx";
import AdminOffers from "./components/admin/AdminOffers.jsx";
import AdminCollections from "./components/admin/AdminCollections.jsx";
import AdminBlog from "./components/admin/AdminBlog.jsx";
import AdminNewsletter from "./components/admin/AdminNewsletter.jsx";
import AdminMessages from "./components/admin/AdminMessages.jsx";
import CustomCursor from "./components/CustomCursor.jsx";
import ProtectedRoute from "./components/ui/ProtectedRoute.jsx";
import BackendStatus from "./components/BackendStatus.jsx";
import PaymentHistory from "./components/PaymentHistory.jsx";

function StorefrontShell({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <WhatsAppButton />}
      {!isAdminRoute && <CustomCursor />}
      <Routes location={location} key={location.pathname}>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="collections" element={<AdminCollections />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>

        <Route
          path="/"
          element={
            <StorefrontShell>
              <Hero />
              <Trending />
              <Categories />
              <Products />
              <Reviews />
              <Brands />
              <Offers />
              <Newsletter />
              <InstagramGallery />
            </StorefrontShell>
          }
        />
        <Route path="/collections" element={<StorefrontShell><Collections /></StorefrontShell>} />
        <Route path="/custom-beauty" element={<StorefrontShell><CustomBeauty /></StorefrontShell>} />
        <Route path="/product/:id" element={<StorefrontShell><ProductDetails /></StorefrontShell>} />
        <Route path="/orders" element={<StorefrontShell><ProtectedRoute><Orders /></ProtectedRoute></StorefrontShell>} />
        <Route path="/cart" element={<StorefrontShell><ProtectedRoute><Cart /></ProtectedRoute></StorefrontShell>} />
        <Route path="/profile" element={<StorefrontShell><ProtectedRoute><Profile /></ProtectedRoute></StorefrontShell>} />
        <Route path="/about" element={<StorefrontShell><About /></StorefrontShell>} />
        <Route path="/contact" element={<StorefrontShell><Contact /></StorefrontShell>} />
        <Route path="/wishlist" element={<StorefrontShell><ProtectedRoute><Wishlist /></ProtectedRoute></StorefrontShell>} />
        <Route path="/login" element={<StorefrontShell><Login /></StorefrontShell>} />
        <Route path="/signup" element={<StorefrontShell><Signup /></StorefrontShell>} />
        <Route path="/register" element={<StorefrontShell><Signup /></StorefrontShell>} />
        <Route path="/checkout" element={<StorefrontShell><ProtectedRoute><Checkout /></ProtectedRoute></StorefrontShell>} />
        <Route path="/track-order" element={<StorefrontShell><OrderTracking /></StorefrontShell>} />
        <Route path="/payment-history" element={<StorefrontShell><ProtectedRoute><PaymentHistory /></ProtectedRoute></StorefrontShell>} />
        <Route path="/faq" element={<StorefrontShell><FAQ /></StorefrontShell>} />
        <Route path="/blog" element={<StorefrontShell><Blog /></StorefrontShell>} />
        <Route path="/blog/:id" element={<StorefrontShell><Blog /></StorefrontShell>} />
        <Route path="/testimonials" element={<StorefrontShell><TestimonialsPage /></StorefrontShell>} />
        <Route path="*" element={<StorefrontShell><NotFound /></StorefrontShell>} />
      </Routes>
    </>
  );
}

export default function App() {

  return (
    <ReactLenis root>
      {/* Silent backend health-check — logs to console only, no UI rendered */}
      <BackendStatus />
      <AuthProvider>
        <AdminAuthProvider>
          <AdminDataProvider>
            <div className="min-h-screen font-body transition-colors duration-300">
              <AppRoutes />
            </div>
          </AdminDataProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ReactLenis>
  );
}
