const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="container-x py-24 max-w-5xl mx-auto">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
          LEGAL
        </p>

        <h1 className="text-5xl md:text-6xl font-black mb-10">
          Privacy Policy
        </h1>

        <div className="space-y-10 text-muted-foreground leading-8 text-lg">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Information We Collect
            </h2>
            <p>
              We collect customer information including name, phone number,
              email address, shipping address, and order details to process
              purchases and improve your shopping experience.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Payment Security
            </h2>
            <p>
              All payments are securely processed through trusted payment
              providers. ANITROH STORE does not store sensitive card or
              banking information on its servers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Customer Privacy
            </h2>
            <p>
              Your personal information is never sold or shared with
              unauthorized third parties. Data is used only for order
              fulfillment, customer support, and service improvement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;