import { Product } from "@/data/products";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}

const ProductSection = ({ eyebrow, title, subtitle, products, viewAllHref }: Props) => (
  <section className="container-x py-16 md:py-20">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
      <div>
        {eyebrow && <p className="text-xs tracking-[0.3em] text-accent font-semibold mb-3">{eyebrow.toUpperCase()}</p>}
        <h2 className="font-display text-3xl md:text-5xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-3 max-w-xl">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link to={viewAllHref} className="text-sm font-semibold tracking-wider uppercase border-b-2 border-foreground pb-1 hover:text-accent hover:border-accent transition-colors self-start md:self-end">
          View All →
        </Link>
      )}
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  </section>
);

export default ProductSection;
