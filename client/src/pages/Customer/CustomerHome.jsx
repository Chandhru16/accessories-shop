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

const CustomerHome = () => {
  const [products, setProducts] = useState(mockProducts);
  const [activeCategory, setActiveCategory] = useState(null); // null = "All"
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    // Once the backend is running, this replaces the mock data.
    api
      .get("/products")
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) setProducts(data);
      })
      .catch(() => {
        // Backend not connected yet — keep showing mock products.
      });
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
