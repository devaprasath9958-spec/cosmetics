import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
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
import Checkout from "./components/Checkout.jsx";
import OrderTracking from "./components/OrderTracking.jsx";
import FAQ from "./components/FAQ.jsx";
import Blog from "./components/Blog.jsx";
import TestimonialsPage from "./components/TestimonialsPage.jsx";
import NotFound from "./components/NotFound.jsx";
export default function App() {
  return (
    <div className="min-h-screen font-body transition-colors duration-300">
      <ScrollToTop />
      <WhatsAppButton />
      <Navbar />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Categories />
                <Products />
                <Reviews />
                <Brands />
                <Offers />
                <Newsletter />
                <InstagramGallery />
              </>
            }
          />
          <Route path="/collections" element={<Collections />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track-order" element={<OrderTracking />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

