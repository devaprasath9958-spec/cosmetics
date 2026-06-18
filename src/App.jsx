import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Categories from "./components/Categories.jsx";
import Products from "./components/Products.jsx";
import Reviews from "./components/Reviews.jsx";
import Brands from "./components/Brands.jsx";
import Offers from "./components/Offers.jsx";
import Newsletter from "./components/Newsletter.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-obsidian font-body text-ivory">
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <Products />
        <Reviews />
        <Brands />
        <Offers />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
