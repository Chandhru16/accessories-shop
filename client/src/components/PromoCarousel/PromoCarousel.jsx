import { useEffect, useRef, useState } from "react";
import api from "../../api/axiosInstance";
import "./PromoCarousel.css";

const AUTO_ADVANCE_MS = 4000;

const PromoCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const autoTimerRef = useRef(null);

  useEffect(() => {
    api
      .get("/banners")
      .then(({ data }) => setBanners(data))
      .catch(() => {
        // No banners set up yet, or backend not reachable — carousel just
        // won't render (see the early return below).
      });
  }, []);

  const scrollToIndex = (index) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
    setActiveIndex(index);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(index);
  };

  // Auto-advance every few seconds, restarting whenever the user manually
  // scrolls/clicks a dot so it doesn't fight with their interaction.
  useEffect(() => {
    if (banners.length <= 1) return;
    clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % banners.length;
        const el = scrollRef.current;
        if (el) el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
        return next;
      });
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(autoTimerRef.current);
  }, [banners.length, activeIndex]);

  if (banners.length === 0) return null;

  const handleBannerClick = (banner) => {
    if (banner.linkUrl) {
      window.open(banner.linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="promo-carousel">
      <div className="promo-scroll" ref={scrollRef} onScroll={handleScroll}>
        {banners.map((banner) => (
          <img
            key={banner._id}
            src={banner.imageUrl}
            alt="Promotion"
            className={banner.linkUrl ? "clickable" : ""}
            onClick={() => handleBannerClick(banner)}
          />
        ))}
      </div>

      {banners.length > 1 && (
        <div className="promo-dots">
          {banners.map((_, i) => (
            <span
              key={i}
              className={`promo-dot ${i === activeIndex ? "active" : ""}`}
              onClick={() => scrollToIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromoCarousel;
