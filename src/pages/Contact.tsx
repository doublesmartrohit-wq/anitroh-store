const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="container-x py-24 max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-sm tracking-[0.35em] uppercase text-muted-foreground mb-4">
            CONTACT
          </p>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8 max-w-4xl">
            We would love to hear from you.
          </h1>

          <p className="text-lg text-muted-foreground leading-8 max-w-3xl">
            For support, collaborations, business inquiries, or order-related
            assistance, feel free to contact the ANITROH STORE team.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="border border-border rounded-3xl p-8 bg-card">
            <h2 className="text-3xl font-bold mb-8">
              Send a Message
            </h2>

            <form className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border border-border rounded-xl p-4 bg-background"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-border rounded-xl p-4 bg-background"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Phone Number
                </label>

                <input
                  type="text"
                  placeholder="Enter your phone number"
                  className="w-full border border-border rounded-xl p-4 bg-background"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Message
                </label>

                <textarea
                  rows={5}
                  placeholder="Write your message..."
                  className="w-full border border-border rounded-xl p-4 bg-background resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="space-y-8">
            <div className="border border-border rounded-3xl p-8 bg-card">
              <h2 className="text-3xl font-bold mb-6">
                Contact Information
              </h2>

              <div className="space-y-5 text-muted-foreground">
                <div>
                  <p className="text-sm uppercase tracking-wider mb-1">
                    Support Email
                  </p>

                  <p className="text-lg text-foreground font-medium">
                    rohitaipowered@gmail.com
                  </p>
                </div>

                <div>
                  <p className="text-sm uppercase tracking-wider mb-1">
                    Phone Number
                  </p>

                  <p className="text-lg text-foreground font-medium">
                    +91 7283037538
                  </p>
                </div>

                <div>
                  <p className="text-sm uppercase tracking-wider mb-1">
                    Support Hours
                  </p>

                  <p className="text-lg text-foreground font-medium">
                    Monday — Saturday · 10 AM — 7 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="border border-border rounded-3xl overflow-hidden bg-card">
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-4">
                  Store Location
                </h2>

                <p className="text-muted-foreground leading-7">
                  Visit our location or connect with us for support and order assistance.
                </p>
              </div>

              <a
                href="https://maps.app.goo.gl/1MiDTMJQRHrDmKGi8"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop"
                  alt="Map Location"
                  className="w-full h-[320px] object-cover hover:scale-[1.02] transition duration-500"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;