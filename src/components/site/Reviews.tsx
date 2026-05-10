import { Star } from "lucide-react";
import { reviews } from "@/data/products";

const Reviews = () => (
  <section className="bg-secondary py-20">
    <div className="container-x">
      <div className="text-center mb-14">
        <p className="text-xs tracking-[0.3em] text-accent font-semibold mb-3">CUSTOMER LOVE</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold">What our customers say</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <figure key={i} className="bg-background p-8 rounded-sm shadow-soft hover-lift">
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: r.rating }).map((_, k) => (
                <Star key={k} size={16} className="fill-accent text-accent" />
              ))}
            </div>
            <blockquote className="text-foreground/80 leading-relaxed mb-6 text-lg font-display italic">
              "{r.text}"
            </blockquote>
            <figcaption>
              <div className="font-semibold">{r.name}</div>
              <div className="text-xs text-muted-foreground tracking-wider uppercase mt-0.5">{r.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

export default Reviews;
