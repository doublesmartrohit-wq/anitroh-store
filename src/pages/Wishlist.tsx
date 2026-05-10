import { useShop } from "@/context/ShopContext";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/site/ProductCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useEffect } from "react";

const Wishlist = () => {
  const { wishlist } = useShop();
  const { products } = useProducts();
  const items = products.filter(p => wishlist.includes(p.id));
  useEffect(() => { document.title = "Wishlist — ANITROH STORE"; }, []);

  return (
    <div className="container-x py-16">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Your Wishlist</h1>
      <p className="text-muted-foreground mb-10">{items.length} saved items</p>
      {items.length === 0 ? (
        <div className="text-center py-24">
          <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="font-display text-2xl mb-3">No favorites yet</p>
          <p className="text-muted-foreground mb-6">Start adding pieces you love.</p>
          <Button asChild variant="hero"><Link to="/">Explore Products</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
          {items.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
