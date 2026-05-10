import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "@/data/products";
import { toast } from "sonner";

export interface CartItem {
  product: Product;
  qty: number;
  size?: string;
  color?: string;
}

interface ShopCtx {
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  addToCart: (p: Product, opts?: { qty?: number; size?: string; color?: string }) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  cartCount: number;
  cartTotal: number;
}

const Ctx = createContext<ShopCtx | null>(null);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("anitroh_cart") || "[]"); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("anitroh_wishlist") || "[]"); } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => { localStorage.setItem("anitroh_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("anitroh_wishlist", JSON.stringify(wishlist)); }, [wishlist]);

  const addToCart: ShopCtx["addToCart"] = (p, opts = {}) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === p.id && i.size === opts.size && i.color === opts.color);
      if (existing) {
        return prev.map(i => i === existing ? { ...i, qty: i.qty + (opts.qty || 1) } : i);
      }
      return [...prev, { product: p, qty: opts.qty || 1, size: opts.size, color: opts.color }];
    });
    toast.success(`${p.name} added to cart`);
    setCartOpen(true);
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.product.id !== id));
  const updateQty = (id: string, qty: number) => setCart(prev =>
    prev.map(i => i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i)
  );
  const clearCart = () => setCart([]);
  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const has = prev.includes(id);
      toast.success(has ? "Removed from wishlist" : "Added to wishlist");
      return has ? prev.filter(x => x !== id) : [...prev, id];
    });
  };

  const cartCount = cart.reduce((a, i) => a + i.qty, 0);
  const cartTotal = cart.reduce((a, i) => a + i.product.price * i.qty, 0);

  return (
    <Ctx.Provider value={{ cart, wishlist, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, clearCart, toggleWishlist, cartCount, cartTotal }}>
      {children}
    </Ctx.Provider>
  );
};

export const useShop = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
};
