import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground mt-24">
    <div className="container-x py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <h3 className="font-display text-2xl font-bold mb-4">ANITROH<span className="gold-text">.</span>STORE</h3>
        <p className="text-sm text-primary-foreground/70 leading-relaxed">
          Premium fashion, footwear, and wellness — crafted for those who appreciate the difference.
        </p>
        <div className="flex gap-3 mt-6">
          {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
            <a key={i} href="#" aria-label="social" className="w-9 h-9 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all">
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold tracking-widest mb-5">SHOP</h4>
        <ul className="space-y-3 text-sm text-primary-foreground/70">
          <li><Link to="/category/men" className="hover:text-accent">Men</Link></li>
          <li><Link to="/category/women" className="hover:text-accent">Women</Link></li>
          <li><Link to="/category/footwear" className="hover:text-accent">Footwear</Link></li>
          <li><Link to="/category/moringa" className="hover:text-accent">Moringa Wellness</Link></li>
          <li><Link to="/category/accessories" className="hover:text-accent">Accessories</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold tracking-widest mb-5">COMPANY</h4>
        <ul className="space-y-3 text-sm text-primary-foreground/70">
          <li><Link to="/about" className="hover:text-accent">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
          <li><Link to="/privacy" className="hover:text-accent">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:text-accent">Terms & Conditions</Link></li>
          <li><Link to="/account" className="hover:text-accent">Track Order</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold tracking-widest mb-5">JOIN THE CLUB</h4>
        <p className="text-sm text-primary-foreground/70 mb-4">Get 10% off your first order plus early access to drops.</p>
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <Input type="email" placeholder="your@email.com" required
            className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50" />
          <Button type="submit" variant="gold" size="icon"><Mail size={16} /></Button>
        </form>
      </div>
    </div>

    <div className="border-t border-primary-foreground/10">
      <div className="container-x py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/60">
        <p>© {new Date().getFullYear()} ANITROH STORE. All rights reserved.</p>
        <p>Crafted with care · Made in India</p>
      </div>
    </div>
  </footer>
);

export default Footer;
