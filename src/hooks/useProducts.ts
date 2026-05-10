import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, Category } from "@/data/products";
import { resolveImage } from "@/lib/productImages";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image: string | null;
  category: string;
  stock: number;
  rating: number | null;
  reviews: number | null;
  sizes: string[] | null;
  colors: any;
  best_seller: boolean | null;
  trending: boolean | null;
  new_arrival: boolean | null;
  active: boolean;
}

export const rowToProduct = (r: ProductRow): Product => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  description: r.description || "",
  price: Number(r.price),
  originalPrice: r.original_price ? Number(r.original_price) : undefined,
  image: r.image || "",
  category: r.category as Category,
  rating: r.rating ? Number(r.rating) : 4.5,
  reviews: r.reviews || 0,
  sizes: r.sizes && r.sizes.length ? r.sizes : undefined,
  colors: r.colors && r.colors.length ? r.colors : undefined,
  stock: r.stock,
  bestSeller: !!r.best_seller,
  trending: !!r.trending,
  newArrival: !!r.new_arrival,
});

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.from("products").select("*").eq("active", true).order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!mounted) return;
        setProducts(((data as unknown as ProductRow[]) || []).map(rowToProduct));
        setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return { products, loading };
};

export const useProduct = (slug: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    let mounted = true;
    supabase.from("products").select("*").eq("slug", slug).maybeSingle()
      .then(({ data }) => {
        if (!mounted) return;
        setProduct(data ? rowToProduct(data as unknown as ProductRow) : null);
        setLoading(false);
      });
    return () => { mounted = false; };
  }, [slug]);

  return { product, loading };
};
