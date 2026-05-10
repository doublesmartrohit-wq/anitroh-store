import { Link } from "react-router-dom";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { Product } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import { cn } from "@/lib/utils";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const wished = wishlist.includes(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <article className="group">
      <div className="relative overflow-hidden bg-secondary aspect-[4/5] mb-4 rounded-sm">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-semibold tracking-wider px-2 py-1">
            -{discount}%
          </span>
        )}
        {product.newArrival && (
          <span className="absolute top-3 right-12 bg-accent text-accent-foreground text-[10px] font-semibold tracking-wider px-2 py-1">
            NEW
          </span>
        )}

        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label="Wishlist"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-soft hover:bg-background transition-all"
        >
          <Heart size={16} className={cn(wished && "fill-destructive text-destructive")} />
        </button>

        <button
          onClick={() => addToCart(product)}
          className="absolute bottom-0 inset-x-0 bg-primary text-primary-foreground py-3 text-xs font-semibold tracking-widest uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
        >
          <ShoppingBag size={14} /> Add to Cart
        </button>
      </div>

      <div>
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium hover:text-accent transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mt-1">
          <Star size={12} className="fill-accent text-accent" />
          <span className="text-xs text-muted-foreground">{product.rating} ({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-sm font-semibold">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
