import { useParams, Link, useNavigate } from "react-router-dom";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import {
  Star,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import ProductCard from "@/components/site/ProductCard";
import { cn } from "@/lib/utils";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { product, loading } = useProduct(slug);
  const { products } = useProducts();

  const { addToCart, toggleWishlist, wishlist } = useShop();

  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — ANITROH STORE`;
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="container-x py-32 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="font-display text-3xl mb-4">
          Product not found
        </h1>

        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const wished = wishlist.includes(product.id);

  const discount = product.originalPrice
    ? Math.round(
        (1 - product.price / product.originalPrice) * 100
      )
    : 0;

  const related = products
    .filter(
      (p) =>
        p.category === product.category &&
        p.id !== product.id
    )
    .slice(0, 4);

  const handleAdd = () => {
    if (product.sizes && !size) return;

    addToCart(product, { size, color });
  };

  const handleBuy = () => {
    if (product.sizes && !size) return;

    addToCart(product, { size, color });

    navigate("/checkout");
  };

  return (
    <div className="container-x py-10">
      <nav className="text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-accent">
          Home
        </Link>{" "}
        /{" "}
        <Link
          to={`/category/${product.category}`}
          className="hover:text-accent capitalize"
        >
          {product.category}
        </Link>{" "}
        / <span>{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        <div
          className={cn(
            "relative aspect-square bg-secondary overflow-hidden rounded-sm cursor-zoom-in",
            zoom && "cursor-zoom-out"
          )}
          onClick={() => setZoom(!zoom)}
        >
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500",
              zoom && "scale-150"
            )}
          />
        </div>

        <div>
          <p className="text-xs tracking-[0.3em] text-accent font-semibold mb-3 uppercase">
            {product.category}
          </p>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(product.rating)
                      ? "fill-accent text-accent"
                      : "text-muted"
                  }
                />
              ))}
            </div>

            <span className="text-sm text-muted-foreground">
              {product.rating} · {product.reviews} reviews
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-display text-3xl font-bold">
              ₹{product.price.toLocaleString()}
            </span>

            {product.originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>

                <span className="text-sm font-semibold text-accent">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-xs text-muted-foreground mb-6">
            Inclusive of all taxes
          </p>

          <p className="text-foreground/80 leading-relaxed mb-8">
            {product.description}
          </p>

          {product.colors && (
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-widest mb-3">
                COLOR{" "}
                {color && (
                  <span className="text-muted-foreground font-normal">
                    · {color}
                  </span>
                )}
              </p>

              <div className="flex gap-2">
                {product.colors.map((c: any) => {
                  const colorName =
                    typeof c === "string"
                      ? c
                      : c.name;

                  const colorHex =
                    colorName.toLowerCase() === "black"
                      ? "#000000"
                      : colorName.toLowerCase() === "white"
                      ? "#FFFFFF"
                      : colorName.toLowerCase() === "brown"
                      ? "#6B4423"
                      : colorName.toLowerCase() === "blue"
                      ? "#2563EB"
                      : colorName.toLowerCase() === "red"
                      ? "#DC2626"
                      : colorName.toLowerCase() === "green"
                      ? "#16A34A"
                      : "#cccccc";

                  return (
                    <button
                      key={colorName}
                      onClick={() =>
                        setColor(colorName)
                      }
                      aria-label={colorName}
                      className={cn(
                        "w-9 h-9 rounded-full border-2 transition-all",
                        color === colorName
                          ? "border-foreground scale-110"
                          : "border-border"
                      )}
                      style={{
                        backgroundColor: colorHex,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {product.sizes && (
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-widest mb-3">
                SIZE
              </p>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "min-w-[48px] h-11 px-3 border text-sm font-medium transition-all",
                      size === s
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm mb-6 flex items-center gap-2">
            <Check
              size={16}
              className="text-accent"
            />

            <span
              className={
                product.stock > 10
                  ? "text-foreground"
                  : "text-destructive"
              }
            >
              {product.stock > 10
                ? "In stock"
                : `Only ${product.stock} left`}
            </span>
          </p>

          <div className="flex gap-3 mb-8">
            <Button
              onClick={handleAdd}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Add to Cart
            </Button>

            <Button
              onClick={handleBuy}
              variant="hero"
              size="lg"
              className="flex-1"
            >
              Buy Now
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12"
              onClick={() =>
                toggleWishlist(product.id)
              }
              aria-label="Wishlist"
            >
              <Heart
                className={cn(
                  wished &&
                    "fill-destructive text-destructive"
                )}
              />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
            {[
              {
                Icon: Truck,
                label: "Free Shipping",
                note: "Above ₹999",
              },
              {
                Icon: RotateCcw,
                label: "Easy Returns",
                note: "7 days",
              },
              {
                Icon: Shield,
                label: "Secure Pay",
                note: "100% safe",
              },
            ].map(({ Icon, label, note }) => (
              <div
                key={label}
                className="text-center"
              >
                <Icon
                  size={20}
                  className="mx-auto mb-2 text-accent"
                />

                <p className="text-xs font-semibold">
                  {label}
                </p>

                <p className="text-xs text-muted-foreground">
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl font-bold mb-8">
            You may also like
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;