const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="container-x py-24 max-w-5xl mx-auto">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
          LEGAL
        </p>

        <h1 className="text-5xl md:text-6xl font-black mb-10">
          Terms & Conditions
        </h1>

        <div className="space-y-10 text-muted-foreground leading-8 text-lg">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Product Availability
            </h2>
            <p>
              Product pricing, availability, and offers may change without
              prior notice depending on stock and operational requirements.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Customer Responsibility
            </h2>
            <p>
              Customers are responsible for providing accurate contact,
              payment, and shipping information during checkout.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Intellectual Property
            </h2>
            <p>
              All website content, branding, product imagery, and designs
              belong to ANITROH STORE and may not be copied or reused
              without permission.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;