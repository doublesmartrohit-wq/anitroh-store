import tshirt from "@/assets/p-tshirt.jpg";
import hoodie from "@/assets/p-hoodie.jpg";
import sneakers from "@/assets/p-sneakers.jpg";
import loafers from "@/assets/p-loafers.jpg";
import moringaPowder from "@/assets/p-moringa-powder.jpg";
import moringaCaps from "@/assets/p-moringa-caps.jpg";
import dress from "@/assets/p-dress.jpg";
import watch from "@/assets/p-watch.jpg";

export type Category = "men" | "women" | "footwear" | "moringa" | "accessories" | "kids";

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: Category;
  rating: number;
  reviews: number;
  description: string;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  stock: number;
  bestSeller?: boolean;
  trending?: boolean;
  newArrival?: boolean;
}

export const products: Product[] = [
  {
    id: "1", slug: "essential-black-tee", name: "Essential Black Tee", price: 899, originalPrice: 1499,
    image: tshirt, category: "men", rating: 4.8, reviews: 234,
    description: "A premium cotton essential. Soft, breathable and built to last. Pre-shrunk for the perfect everyday fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Black", hex: "#0a0a0a" }, { name: "White", hex: "#f5f5f5" }, { name: "Beige", hex: "#d8c9a3" }],
    stock: 42, bestSeller: true, trending: true,
  },
  {
    id: "2", slug: "oversized-beige-hoodie", name: "Oversized Beige Hoodie", price: 1899, originalPrice: 2799,
    image: hoodie, category: "men", rating: 4.7, reviews: 187,
    description: "Heavyweight 400 GSM fleece hoodie. Oversized fit with kangaroo pocket. Streetwear refined.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Beige", hex: "#e6c9a8" }, { name: "Black", hex: "#0a0a0a" }],
    stock: 28, bestSeller: true, newArrival: true,
  },
  {
    id: "3", slug: "minimal-white-sneakers", name: "Minimal White Sneakers", price: 2499, originalPrice: 3999,
    image: sneakers, category: "footwear", rating: 4.9, reviews: 412,
    description: "Genuine leather, hand-stitched and built on a cushioned sole. The everyday sneaker, perfected.",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: [{ name: "White", hex: "#ffffff" }, { name: "Cream", hex: "#f5ecd9" }],
    stock: 16, bestSeller: true, trending: true,
  },
  {
    id: "4", slug: "classic-leather-loafers", name: "Classic Leather Loafers", price: 3299, originalPrice: 4999,
    image: loafers, category: "footwear", rating: 4.8, reviews: 156,
    description: "Italian leather loafers, hand-finished. Office to evening, effortlessly.",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: [{ name: "Tan", hex: "#a0633a" }, { name: "Black", hex: "#0a0a0a" }],
    stock: 12, trending: true,
  },
  {
    id: "5", slug: "organic-moringa-powder", name: "Organic Moringa Powder 250g", price: 599, originalPrice: 899,
    image: moringaPowder, category: "moringa", rating: 4.9, reviews: 893,
    description: "100% pure cold-dried moringa leaf powder. Loaded with vitamins, iron and antioxidants. Lab-tested purity.",
    stock: 120, bestSeller: true,
  },
  {
    id: "6", slug: "moringa-capsules-90", name: "Moringa Capsules (90 count)", price: 749, originalPrice: 1099,
    image: moringaCaps, category: "moringa", rating: 4.7, reviews: 421,
    description: "Vegetarian capsules with 500mg pure moringa extract. Daily wellness, simplified.",
    stock: 80, newArrival: true,
  },
  {
    id: "7", slug: "elegant-cream-midi-dress", name: "Elegant Cream Midi Dress", price: 2199, originalPrice: 3499,
    image: dress, category: "women", rating: 4.8, reviews: 211,
    description: "Flowy midi cut with a flattering V-neckline. Effortless elegance for any occasion.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [{ name: "Cream", hex: "#f5ecd9" }, { name: "Black", hex: "#0a0a0a" }],
    stock: 24, bestSeller: true, newArrival: true,
  },
  {
    id: "8", slug: "gold-classic-watch", name: "Gold Classic Watch", price: 4499, originalPrice: 6999,
    image: watch, category: "accessories", rating: 4.9, reviews: 98,
    description: "Sapphire-coated dial with genuine leather strap. A timeless heirloom in the making.",
    colors: [{ name: "Gold/Tan", hex: "#c8a052" }],
    stock: 9, trending: true, newArrival: true,
  },
];

export const getProduct = (slug: string) => products.find(p => p.slug === slug);
export const getByCategory = (cat: Category) => products.filter(p => p.category === cat);

export const reviews = [
  { name: "Priya Sharma", text: "Quality is genuinely premium. The fabric and finish exceeded my expectations.", rating: 5, role: "Verified Buyer" },
  { name: "Arjun Mehta", text: "Fast delivery and the moringa powder is the freshest I've tried. Highly recommend.", rating: 5, role: "Verified Buyer" },
  { name: "Sneha Reddy", text: "Loved the dress — perfect fit and stunning craftsmanship. Will buy again.", rating: 5, role: "Verified Buyer" },
];
