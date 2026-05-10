import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const CartDrawer = () => {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal } = useShop();

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  return (
    <>
      <div
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 transition-opacity ${cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-background z-50 shadow-elegant transition-transform duration-500 flex flex-col ${cartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display text-xl font-semibold">Your Cart ({cart.length})</h2>
          <button onClick={() => setCartOpen(false)} aria-label="Close" className="p-2 hover:text-accent">
            <X size={20} />
          </button>
        </header>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <ShoppingBag size={48} className="text-muted-foreground mb-4" />
            <p className="font-display text-xl mb-2">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mb-6">Discover something you'll love.</p>
            <Button onClick={() => setCartOpen(false)} variant="hero">Continue Shopping</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <img src={item.product.image} alt={item.product.name} className="w-20 h-24 object-cover rounded-sm bg-secondary" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium line-clamp-1">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.size && `Size ${item.size}`} {item.color && `· ${item.color}`}
                    </p>
                    <p className="text-sm font-semibold mt-1">₹{item.product.price.toLocaleString()}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border rounded-sm">
                        <button onClick={() => updateQty(item.product.id, item.qty - 1)} className="p-1.5 hover:bg-secondary"><Minus size={12} /></button>
                        <span className="px-3 text-xs">{item.qty}</span>
                        <button onClick={() => updateQty(item.product.id, item.qty + 1)} className="p-1.5 hover:bg-secondary"><Plus size={12} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} aria-label="Remove" className="p-1 text-muted-foreground hover:text-destructive">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-border p-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold text-accent">{cartTotal >= 999 ? "FREE" : "₹99"}</span>
              </div>
              <div className="flex justify-between text-base border-t border-border pt-4">
                <span className="font-semibold">Total</span>
                <span className="font-display font-bold text-xl">₹{(cartTotal + (cartTotal >= 999 ? 0 : 99)).toLocaleString()}</span>
              </div>
              <Button asChild variant="hero" size="lg" className="w-full" onClick={() => setCartOpen(false)}>
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
              <p className="text-xs text-center text-muted-foreground">Secure checkout · COD available</p>
            </footer>
          </>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
