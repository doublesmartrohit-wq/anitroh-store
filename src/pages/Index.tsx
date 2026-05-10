import HeroCarousel from "@/components/site/HeroCarousel";
import ProductSection from "@/components/site/ProductSection";
import CategoryGrid from "@/components/site/CategoryGrid";
import OfferBanner from "@/components/site/OfferBanner";
import Reviews from "@/components/site/Reviews";
import { useProducts } from "@/hooks/useProducts";
import { useEffect } from "react";

const Index = () => {
  const { products } = useProducts();

  useEffect(() => {
    document.title = "ANITROH STORE — Premium Fashion, Footwear & Moringa Wellness";
    const desc = "Shop premium clothing, footwear, accessories & pure Moringa wellness at ANITROH STORE. Free shipping above ₹999. COD available pan India.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); }
    m.setAttribute("content", desc);
  }, []);

  return (
    <>
      <HeroCarousel />
      <ProductSection
        eyebrow="Best Sellers"
        title="Loved by thousands"
        subtitle="Our most-wanted pieces, hand-picked by you."
        products={products.filter(p => p.bestSeller)}
        viewAllHref="/categories"
      />
      <CategoryGrid />
      <ProductSection
        eyebrow="Trending Now"
        title="Featured & Trending"
        products={products.filter(p => p.trending)}
        viewAllHref="/categories"
      />
      <OfferBanner />
      <ProductSection
        eyebrow="New Arrivals"
        title="Fresh off the rack"
        products={products.filter(p => p.newArrival)}
        viewAllHref="/categories"
      />
      <Reviews />
    </>
  );
};

export default Index;
