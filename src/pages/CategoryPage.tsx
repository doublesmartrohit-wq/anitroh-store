import { useParams, Link } from "react-router-dom";
import { Category } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/site/ProductCard";
import { useEffect, useState, useMemo } from "react";

const titles: Record<string, string> = {
  men: "Men's Collection",
  women: "Women's Collection",
  footwear: "Footwear",
  moringa: "Moringa Wellness",
  accessories: "Accessories",
  kids: "Kids",
};

const CategoryPage = () => {
  const { cat } = useParams<{ cat: string }>();
  const { products } = useProducts();
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(10000);

  const list = useMemo(() => {
    let l = cat ? products.filter(p => p.category === (cat as Category)) : products;
    l = l.filter(p => p.price <= maxPrice);
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating);
    return l;
  }, [cat, sort, maxPrice, products]);

  const title = cat ? titles[cat] || "All Products" : "All Products";

  useEffect(() => {
    document.title = `${title} — ANITROH STORE`;
  }, [title]);

  return (
    <div className="container-x py-12">
      <nav className="text-xs text-muted-foreground mb-4">
        <Link to="/" className="hover:text-accent">Home</Link> / <span>{title}</span>
      </nav>
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">{title}</h1>
      <p className="text-muted-foreground mb-10">{list.length} products</p>

      <div className="grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="space-y-8 lg:sticky lg:top-28 self-start">
          <div>
            <h3 className="text-xs font-semibold tracking-widest mb-4">PRICE</h3>
            <input type="range" min={500} max={10000} step={100} value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-accent" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>₹500</span><span>Up to ₹{maxPrice.toLocaleString()}</span>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-widest mb-4">CATEGORIES</h3>
            <ul className="space-y-2 text-sm">
              {Object.entries(titles).map(([k, v]) => (
                <li key={k}>
                  <Link to={`/category/${k}`} className={`hover:text-accent ${cat === k ? "text-accent font-semibold" : "text-muted-foreground"}`}>
                    {v}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          <div className="flex justify-end mb-6">
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="border border-border bg-background px-4 py-2 text-sm rounded-sm">
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          {list.length === 0 ? (
            <p className="text-muted-foreground py-20 text-center">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6">
              {list.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
