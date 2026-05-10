import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [pay, setPay] = useState("cod");
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const UPI_REGEX = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/;
  const [profile, setProfile] = useState<any>(null);
  const shipping = cartTotal <= 100 ? 0 : 40;
  const total = cartTotal - discount + shipping;

  useEffect(() => { document.title = "Checkout — ANITROH STORE"; }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  const applyCoupon = async () => {
  const code = coupon.trim().toUpperCase();

  if (!code) return;

  const { data }: any = await (supabase as any)
    .from("coupons")
    .select("*")
    .eq("code", code)
    .eq("active", true)
    .maybeSingle();

  if (!data) {
    return toast.error("Invalid or inactive coupon");
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return toast.error("Coupon has expired");
  }

  if (data.max_uses && data.used_count >= data.max_uses) {
    return toast.error("Coupon usage limit reached");
  }

  if (cartTotal < Number(data.min_order)) {
    return toast.error(`Minimum order ₹${data.min_order}`);
  }

  const value =
    data.discount_type === "percent"
      ? Math.round((cartTotal * Number(data.discount_value)) / 100)
      : Number(data.discount_value);

  setDiscount(Math.min(value, cartTotal));
  setAppliedCoupon(code);

  toast.success(`Coupon ${code} applied!`);
};

  type CheckoutFields = {
    full_name: string; phone: string; email: string; address: string;
    city: string; state: string; pincode: string;
  };

  const validateCheckout = (fd: FormData): CheckoutFields | null => {
    const f: CheckoutFields = {
      full_name: String(fd.get("full_name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      address: String(fd.get("address") || "").trim(),
      city: String(fd.get("city") || "").trim(),
      state: String(fd.get("state") || "").trim(),
      pincode: String(fd.get("pincode") || "").trim(),
    };
    if (!f.full_name) { toast.error("Full name is required"); return null; }
    if (!/^\d{10}$/.test(f.phone.replace(/\D/g, "").slice(-10))) { toast.error("Enter a valid 10-digit phone"); return null; }
    if (!f.address) { toast.error("Address is required"); return null; }
    if (!f.city) { toast.error("City is required"); return null; }
    if (!f.state) { toast.error("State is required"); return null; }
    if (!/^\d{6}$/.test(f.pincode)) { toast.error("Enter a valid 6-digit pincode"); return null; }
    if (!pay) { toast.error("Select a payment method"); return null; }
    return f;
  };

  const createOrder = async (
  f: CheckoutFields,
  paymentStatus: "pending" | "paid",
  paymentRef?: string
) => {

  const { data: order, error }: any = await supabase
    .from("orders")
    .insert({
      user_id: user!.id,
      subtotal: cartTotal,
      discount,
      shipping,
      total,
      payment_method: pay,
      payment_status: paymentStatus,
      coupon_code: appliedCoupon,
      full_name: f.full_name,
      phone: f.phone,
      email: f.email,
      address_line1: f.address,
      city: f.city,
      state: f.state,
      pincode: f.pincode,
      notes: paymentRef ? `razorpay:${paymentRef}` : null,
    })
    .select()
    .single();

  if (error || !order) {
    throw new Error(error?.message || "Failed to create order");
  }

  const items = cart.map(i => ({
    order_id: order.id,
    product_id: i.product.id,
    name: i.product.name,
    image: i.product.image,
    price: i.product.price,
    quantity: i.qty,
    size: i.size || null,
    color: i.color || null,
  }));

  const { error: itemErr } = await supabase
    .from("order_items")
    .insert(items);

  if (itemErr) {
    throw new Error(itemErr.message);
  }

  await fetch("http://localhost:3001/send-order-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: f.email,
      full_name: f.full_name,
      order_id: order.id,
      total,
    }),
  });

  return order;
};

  const initiatePayment = (f: CheckoutFields) =>
    new Promise<{ razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }>(async (resolve, reject) => {
      try {
        const { data: rp, error: rpErr } = await supabase.functions.invoke("razorpay-create-order", {
          body: { amount: total, receipt: `rcpt_${Date.now()}` },
        });
        if (rpErr || !rp?.orderId) return reject(new Error(rpErr?.message || "Failed to start payment"));
        const RZP = (window as any).Razorpay;
        if (!RZP) return reject(new Error("Razorpay SDK not loaded"));
        const rzp = new RZP({
          key: rp.keyId,
          amount: rp.amount,
          currency: rp.currency,
          name: "ANITROH STORE",
          description: "Order Payment",
          order_id: rp.orderId,
          prefill: { name: f.full_name, email: user!.email || "", contact: f.phone },
          theme: { color: "#000000" },
          handler: (resp: any) => resolve(resp),
          modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
        });
        rzp.on?.("payment.failed", (resp: any) =>
          reject(new Error(resp?.error?.description || "Payment failed"))
        );
        rzp.open();
      } catch (e: any) {
        reject(e);
      }
    });

  const verifyPayment = async (
    resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }
  ) => {
    const { data: ver, error: verErr } = await supabase.functions.invoke("razorpay-verify-payment", {
      body: resp,
    });
    if (verErr || !ver?.verified) throw new Error("Payment verification failed");
  };

  const placeOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/auth");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const fields = validateCheckout(fd);
    if (!fields) return;

    if (pay === "upi") {
      if (!UPI_REGEX.test(upiId.trim())) {
        setUpiError("Enter a valid UPI ID (e.g. yourname@paytm)");
        toast.error("Enter a valid UPI ID");
        return;
      }
      setUpiError("");
    }

    setSubmitting(true);
    try {
      if (pay === "razorpay" || pay === "upi") {
        const resp = await initiatePayment(fields);
        await verifyPayment(resp);
        const order = await createOrder(fields, "paid", resp.razorpay_payment_id);
        await supabase.from("orders").update({
          notes: `${pay}:${resp.razorpay_payment_id}${pay === "upi" ? `:${upiId.trim()}` : ""}`,
        }).eq("id", order.id);
        toast.success(`Payment successful! Order #${order.id.slice(0, 8).toUpperCase()}`);
        clearCart();
        setTimeout(() => navigate("/account"), 800);
      } else {
        const order = await createOrder(fields, "pending");
        toast.success(`Order #${order.id.slice(0, 8).toUpperCase()} placed successfully!`);
        clearCart();
        setTimeout(() => navigate("/account"), 800);
      }
    } catch (err: any) {
      const msg = err?.message || "Something went wrong";
      if (/cancel/i.test(msg)) toast.error("Payment cancelled — order not placed");
      else toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="font-display text-3xl mb-4">Your cart is empty</h1>
        <Button asChild variant="hero"><Link to="/">Continue Shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="container-x py-12">
      <h1 className="font-display text-4xl font-bold mb-10">Checkout</h1>
      {!user && (
        <div className="border border-accent/40 bg-accent/5 p-4 mb-6 rounded-sm text-sm">
          Please <Link to="/auth" className="text-accent font-semibold underline">sign in</Link> to place your order.
        </div>
      )}
      <form onSubmit={placeOrder} className="grid lg:grid-cols-[1fr_400px] gap-10">
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-xl font-semibold mb-5">Contact & Shipping</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Full Name</Label><Input name="full_name" required defaultValue={profile?.full_name || ""} /></div>
              <div><Label>Phone</Label><Input name="phone" required type="tel" defaultValue={profile?.phone || ""} /></div>
              <div className="sm:col-span-2"><Label>Email</Label><Input  
  name="email"
  required
  type="email"
  defaultValue={user?.email || ""}
/></div>
              <div className="sm:col-span-2"><Label>Address</Label><Input name="address" required defaultValue={profile?.address_line1 || ""} /></div>
              <div><Label>City</Label><Input name="city" required defaultValue={profile?.city || ""} /></div>
              <div><Label>State</Label><Input name="state" required defaultValue={profile?.state || ""} /></div>
              <div><Label>Pincode</Label><Input name="pincode" required pattern="\d{6}" defaultValue={profile?.pincode || ""} /></div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-5">Payment Method</h2>
            <div className="space-y-3">
              {[
                { id: "razorpay", label: "Razorpay", note: "UPI, Cards, Netbanking, Wallets — secure" },
                { id: "upi", label: "UPI", note: "Google Pay, PhonePe, Paytm" },
                { id: "cod", label: "Cash on Delivery", note: "Pay when you receive" },
              ].map(m => (
                <div key={m.id}>
                  <label className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all ${pay === m.id ? "border-foreground bg-secondary" : "border-border"}`}>
                    <input type="radio" name="pay" value={m.id} checked={pay === m.id} onChange={() => { setPay(m.id); setUpiError(""); }} className="accent-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.note}</p>
                    </div>
                    {pay === m.id && <Check size={18} className="text-accent" />}
                  </label>
                  {m.id === "upi" && pay === "upi" && (
                    <div className="mt-3 ml-4 pl-4 border-l-2 border-accent/40">
                      <Label className="text-xs">UPI ID</Label>
                      <Input
                        value={upiId}
                        onChange={(e) => { setUpiId(e.target.value); if (upiError) setUpiError(""); }}
                        placeholder="yourname@paytm / yourname@ybl / yourname@oksbi"
                        className="mt-1"
                        autoComplete="off"
                      />
                      {upiError && <p className="text-xs text-destructive mt-1">{upiError}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="bg-secondary p-6 rounded-sm h-fit lg:sticky lg:top-28">
          <h2 className="font-display text-xl font-semibold mb-5">Order Summary</h2>
          <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
            {cart.map((i, k) => (
              <div key={k} className="flex gap-3 text-sm">
                <img src={i.product.image} alt={i.product.name} className="w-14 h-16 object-cover rounded-sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium line-clamp-1">{i.product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {i.qty}</p>
                </div>
                <p className="font-semibold">₹{(i.product.price * i.qty).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-5">
            <Input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" className="bg-background" />
            <Button type="button" variant="outline" onClick={applyCoupon}>Apply</Button>
          </div>

          <div className="space-y-2 text-sm border-t border-border pt-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
            {discount > 0 && <div className="flex justify-between text-accent"><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
            <div className="flex justify-between font-display text-xl font-bold border-t border-border pt-3 mt-3">
              <span>Total</span><span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full mt-6" disabled={submitting || !user}>
            {submitting ? "Placing..." : "Place Order"}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-3">By placing the order you agree to our Terms.</p>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;
