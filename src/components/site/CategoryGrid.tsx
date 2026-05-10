import { Link } from "react-router-dom";
import catMen from "@/assets/cat-men.jpg";
import catWomen from "@/assets/cat-women.jpg";
import catFootwear from "@/assets/cat-footwear.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";
import moringa from "@/assets/hero-moringa.jpg";

const cats = [
  { to: "/category/men", label: "Men", img: catMen },
  { to: "/category/women", label: "Women", img: catWomen },
  { to: "/category/footwear", label: "Footwear", img: catFootwear },
  { to: "/category/moringa", label: "Moringa", img: moringa },
  { to: "/category/accessories", label: "Accessories", img: catAccessories },
];

const CategoryGrid = () => (
  <section className="container-x py-20">
    <div className="text-center mb-12">
      <p className="text-xs tracking-[0.3em] text-accent font-semibold mb-3">EXPLORE</p>
      <h2 className="font-display text-4xl md:text-5xl font-bold">Shop by Category</h2>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
      {cats.map((c) => (
        <Link key={c.to} to={c.to} className="group relative block aspect-[3/4] overflow-hidden rounded-sm hover-lift">
          <img src={c.img} alt={c.label} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-5 text-primary-foreground">
            <h3 className="font-display text-2xl font-semibold">{c.label}</h3>
            <span className="text-xs tracking-widest opacity-80 group-hover:text-accent transition-colors">SHOP NOW →</span>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

export default CategoryGrid;
