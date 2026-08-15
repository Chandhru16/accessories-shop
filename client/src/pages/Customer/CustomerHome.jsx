import { useEffect, useMemo, useState } from "react";
import ShopHeader from "../../components/ShopHeader/ShopHeader";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar";
import PromoCarousel from "../../components/PromoCarousel/PromoCarousel";
import ProductCard from "../../components/ProductCard/ProductCard";
import CartDrawer from "../../components/Cart/CartDrawer";
import Footer from "../../components/Footer/Footer";
import api from "../../api/axiosInstance";
import mockProducts from "../../data/products";
import "./CustomerHome.css";

// Fisher-Yates shuffle — so products don't always appear in the same
// fixed "owner entered them in this order" sequence every time someone
// visits. Re-shuffled fresh each time the product list is (re)loaded.
const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const CustomerHome = () => {
  const [products, setProducts] = useState(() => shuffleArray(mockProducts));
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null); // null = "All"
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    api
      .get("/products")
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(shuffleArray(data));
        }
      })
      .catch(() => {
        // Backend not reachable — keep showing the (already shuffled) mock
        // products rather than an empty page.
      })
      .finally(() => setIsLoadingProducts(false));
  }, []);

  const handleCategoryChange = (categoryName, subcategoryName) => {
    setActiveCategory(categoryName);
    setActiveSubcategory(subcategoryName);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = !activeCategory || p.category === activeCategory;
      const matchesSubcategory =
        !activeSubcategory || p.subcategory === activeSubcategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSubcategory && matchesSearch;
    });
  }, [products, activeCategory, activeSubcategory, searchTerm]);

  return (
    <div className="customer-home">
      <ShopHeader />
      <CustomerNavbar
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
        onCategoryChange={handleCategoryChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCartClick={() => setShowCart(true)}
      />

      <PromoCarousel />

      {isLoadingProducts && (
        <div className="products-loading-bar">
          <span className="products-loading-spinner" />
          Loading latest products...
        </div>
      )}

      <main className="product-grid">
        {filteredProducts.length === 0 ? (
          <p className="no-products">No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </main>

      {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
      <Footer />
    </div>
  );
};

export default CustomerHome;
