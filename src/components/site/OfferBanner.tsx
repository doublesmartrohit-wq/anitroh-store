import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const OfferBanner = () => (
  <section className="container-x py-8">
    <div className="relative overflow-hidden rounded-sm bg-gradient-dark text-primary-foreground p-10 md:p-16 lg:p-20">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative max-w-2xl">
        <p className="text-xs tracking-[0.3em] text-accent font-semibold mb-4">LIMITED TIME OFFER</p>
        <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-5">
          Flat <span className="gold-text">10% OFF</span><br />on the Season Edit
        </h2>
        <p className="text-primary-foreground/70 mb-8 text-lg">
          Use code <span className="font-mono font-semibold text-accent">ANITROH10</span> at checkout. Sale ends soon.
        </p>
        <Button asChild variant="gold" size="xl">
          <Link to="/categories">Shop The Sale</Link>
        </Button>
      </div>
    </div>
  </section>
);

export default OfferBanner;
