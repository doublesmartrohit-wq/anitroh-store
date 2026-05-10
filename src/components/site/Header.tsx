import { Link, NavLink } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/category/men", label: "Men" },
  { to: "/category/women", label: "Women" },
  { to: "/category/footwear", label: "Footwear" },
  { to: "/category/moringa", label: "Moringa" },
  { to: "/categories", label: "Categories" },
];

const Header = () => {
  const { cartCount, setCartOpen, wishlist } = useShop();
  const { session } = useAuth();
  const accountHref = session ? "/account" : "/auth";
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground text-xs tracking-widest py-2 overflow-hidden">
        <div className="flex whitespace-nowrap marquee">
          <div className="flex shrink-0 gap-12 px-6">
            <span>FREE SHIPPING ON ORDERS ABOVE ₹999</span>
            <span>•</span>
            <span>NEW SEASON DROP — UP TO 40% OFF</span>
            <span>•</span>
            <span>COD AVAILABLE PAN INDIA</span>
            <span>•</span>
            <span>PREMIUM QUALITY GUARANTEED</span>
          </div>
          <div className="flex shrink-0 gap-12 px-6" aria-hidden="true">
            <span>FREE SHIPPING ON ORDERS ABOVE ₹999</span>
            <span>•</span>
            <span>NEW SEASON DROP — UP TO 40% OFF</span>
            <span>•</span>
            <span>COD AVAILABLE PAN INDIA</span>
            <span>•</span>
            <span>PREMIUM QUALITY GUARANTEED</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-lg border-b border-border">
        <div className="container-x flex items-center justify-between h-16 lg:h-20">
          <button className="lg:hidden p-2 -ml-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="font-display text-xl lg:text-2xl font-bold tracking-tight">
            ANITROH<span className="gold-text"> .</span>STORE
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wide transition-colors hover:text-accent ${isActive ? "text-accent" : "text-foreground"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={18} />
            </Button>
            <Link to="/wishlist" aria-label="Wishlist" className="relative p-2 hover:text-accent transition-colors">
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/account" aria-label="Account" className="hidden sm:block p-2 hover:text-accent transition-colors">
              <User size={18} />
            </Link>
            <button onClick={() => setCartOpen(true)} aria-label="Cart" className="relative p-2 hover:text-accent transition-colors">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="lg:hidden border-t border-border bg-background animate-fade-in">
            <nav className="container-x flex flex-col py-4">
              {links.map(l => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm font-medium border-b border-border last:border-0"
                >
                  {l.label}
                </NavLink>
              ))}
              <Link to="/account" onClick={() => setOpen(false)} className="py-3 text-sm font-medium">My Account</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md animate-fade-in" onClick={() => setSearchOpen(false)}>
          <div className="container-x pt-24" onClick={e => e.stopPropagation()}>
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 border-b-2 border-foreground pb-3">
                <Search size={24} />
                <input
                  autoFocus
                  type="search"
                  placeholder="Search for products, brands, categories..."
                  className="flex-1 bg-transparent outline-none text-lg placeholder:text-muted-foreground"
                />
                <button onClick={() => setSearchOpen(false)} aria-label="Close"><X size={20} /></button>
              </div>
              <div className="mt-6 text-sm text-muted-foreground">
                Try: <Link to="/category/moringa" onClick={() => setSearchOpen(false)} className="underline mx-1">Moringa</Link>
                <Link to="/category/footwear" onClick={() => setSearchOpen(false)} className="underline mx-1">Sneakers</Link>
                <Link to="/category/women" onClick={() => setSearchOpen(false)} className="underline mx-1">Dresses</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
