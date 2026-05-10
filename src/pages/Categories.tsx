import { Link } from "react-router-dom";
import catMen from "@/assets/cat-men.jpg";
import catWomen from "@/assets/cat-women.jpg";
import catFootwear from "@/assets/cat-footwear.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";
import moringa from "@/assets/hero-moringa.jpg";
import { useEffect } from "react";

const all = [
  { to: "/category/men", label: "Men", img: catMen, count: 124 },
  { to: "/category/women", label: "Women", img: catWomen, count: 187 },
  { to: "/category/footwear", label: "Footwear", img: catFootwear, count: 92 },
  { to: "/category/moringa", label: "Moringa Wellness", img: moringa, count: 24 },
  { to: "/category/accessories", label: "Accessories", img: catAccessories, count: 56 },
  { to: "/category/kids", label: "Kids", img: catMen, count: 48 },
];

const Categories = () => {
  useEffect(() => { document.title = "All Categories — ANITROH STORE"; }, []);
  return (
    <div className="container-x py-12">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">All Categories</h1>
      <p className="text-muted-foreground mb-10">Explore our entire collection</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {all.map(c => (
          <Link key={c.to} to={c.to} className="group relative aspect-[4/5] overflow-hidden rounded-sm hover-lift">
            <img src={c.img} alt={c.label} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6 text-primary-foreground">
              <h2 className="font-display text-3xl font-semibold">{c.label}</h2>
              <p className="text-sm opacity-80">{c.count} products</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
