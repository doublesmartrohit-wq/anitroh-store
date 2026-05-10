const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="container-x py-24 max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            ANITROH STORE
          </p>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8 max-w-4xl">
            Premium fashion built for modern lifestyle.
          </h1>

          <p className="text-lg text-muted-foreground leading-8 max-w-3xl">
            ANITROH STORE is a premium lifestyle brand focused on elevated fashion,
            footwear, and wellness essentials. We combine clean aesthetics,
            comfort, and modern streetwear culture to create products designed
            for everyday confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="border border-border p-8 rounded-2xl bg-card">
            <h3 className="text-2xl font-bold mb-4">Quality First</h3>
            <p className="text-muted-foreground leading-7">
              Every product is selected with attention to fabric quality,
              comfort, durability, and modern fit.
            </p>
          </div>

          <div className="border border-border p-8 rounded-2xl bg-card">
            <h3 className="text-2xl font-bold mb-4">Modern Aesthetic</h3>
            <p className="text-muted-foreground leading-7">
              We believe premium fashion should feel minimal, bold,
              and timeless.
            </p>
          </div>

          <div className="border border-border p-8 rounded-2xl bg-card">
            <h3 className="text-2xl font-bold mb-4">Built For Lifestyle</h3>
            <p className="text-muted-foreground leading-7">
               From oversized streetwear to wellness essentials,
              ANITROH STORE is designed around modern lifestyle culture.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;