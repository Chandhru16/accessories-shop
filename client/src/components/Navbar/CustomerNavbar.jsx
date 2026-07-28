import { useRef, useState, useEffect } from "react";
import { FaShoppingCart, FaSearch, FaChevronDown } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import NotificationBell from "./NotificationBell";
import CATEGORY_TREE from "../../data/categories";
import "./CustomerNavbar.css";

const CustomerNavbar = ({
  activeCategory,
  activeSubcategory,
  onCategoryChange, // (categoryName, subcategoryName) — pass null/null for "All"
  searchTerm,
  onSearchChange,
  onCartClick,
}) => {
  const { cartCount } = useCart();
  const [openCategory, setOpenCategory] = useState(null); // category name currently expanded
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpenCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePillClick = (categoryName) => {
    setOpenCategory((prev) => (prev === categoryName ? null : categoryName));
  };

  const handleSubcategorySelect = (categoryName, subcategoryName) => {
    onCategoryChange(categoryName, subcategoryName);
    setOpenCategory(null);
  };

  const openCategoryData = CATEGORY_TREE.find((c) => c.name === openCategory);

  return (
    <header className="navbar" ref={wrapRef}>
      <div className="navbar-top">
        <div className="navbar-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <NotificationBell />

        <button className="cart-button" onClick={onCartClick}>
          <FaShoppingCart size={22} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>

      {/* This row scrolls horizontally on its own — it must NOT contain the
          dropdown panel, or the browser clips the panel to this scroll box. */}
      <nav className="navbar-categories">
        <button
          className={`category-pill ${!activeCategory ? "active" : ""}`}
          onClick={() => handleSubcategorySelect(null, null)}
        >
          All
        </button>

        {CATEGORY_TREE.map((cat) => (
          <button
            key={cat.name}
            className={`category-pill ${activeCategory === cat.name ? "active" : ""} ${
              openCategory === cat.name ? "open" : ""
            }`}
            onClick={() => handlePillClick(cat.name)}
          >
            {cat.name} <FaChevronDown size={10} />
          </button>
        ))}
      </nav>

      {/* Rendered as a sibling of the scrolling row above, so it can never
          get clipped by that row's overflow-x. Full-width panel, not
          anchored to the clicked pill's position. */}
      {openCategoryData && (
        <div className="subcategory-panel">
          <button
            className="category-dropdown-item"
            onClick={() => handleSubcategorySelect(openCategoryData.name, null)}
          >
            All {openCategoryData.name}
          </button>
          {openCategoryData.subcategories.map((sub) => (
            <button
              key={sub}
              className={`category-dropdown-item ${
                activeSubcategory === sub ? "active" : ""
              }`}
              onClick={() => handleSubcategorySelect(openCategoryData.name, sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default CustomerNavbar;
