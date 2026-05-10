import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import fashion from "@/assets/hero-fashion.jpg";
import footwear from "@/assets/hero-footwear.jpg";
import newArrivals from "@/assets/hero-newarrivals.jpg";
import moringa from "@/assets/hero-moringa.jpg";

const slides = [
  { img: fashion, eyebrow: "Season Sale", title: "Fashion that defines you", subtitle: "Up to 40% off curated styles for men & women.", cta: "Shop Fashion", to: "/category/men" },
  { img: footwear, eyebrow: "Footwear Edit", title: "Step into the new season", subtitle: "Hand-finished sneakers and loafers, built to last.", cta: "Shop Footwear", to: "/category/footwear" },
  { img: newArrivals, eyebrow: "Just In", title: "New Arrivals are here", subtitle: "Fresh drops, refined silhouettes, premium fabrics.", cta: "Discover New", to: "/category/women" },
  { img: moringa, eyebrow: "Wellness", title: "Pure Moringa, pure power", subtitle: "Lab-tested wellness products from nature's vault.", cta: "Shop Wellness", to: "/category/moringa" },
];

const HeroCarousel = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(p => (p + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  const next = () => setI(p => (p + 1) % slides.length);
  const prev = () => setI(p => (p - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[78vh] min-h-[520px] max-h-[760px] overflow-hidden bg-secondary">
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <img src={s.img} alt={s.title} className="w-full h-full object-cover" loading={idx === 0 ? "eager" : "lazy"} fetchPriority={idx === 0 ? "high" : "auto"} />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
          <div className="container-x relative h-full flex items-center">
            <div className={`max-w-xl ${idx === i ? "animate-slide-up" : ""}`}>
              <p className="text-xs tracking-[0.3em] text-accent font-semibold mb-4">{s.eyebrow.toUpperCase()}</p>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-5">
                {s.title}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-md">{s.subtitle}</p>
              <Button asChild variant="hero" size="xl">
                <Link to={s.to}>{s.cta}</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}

      <button onClick={prev} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background shadow-soft z-10">
        <ChevronLeft size={18} />
      </button>
      <button onClick={next} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background shadow-soft z-10">
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-1 transition-all rounded-full ${idx === i ? "bg-accent w-10" : "bg-foreground/30 w-5"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
