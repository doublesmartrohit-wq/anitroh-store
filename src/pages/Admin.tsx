import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Plus, Trash2, Pencil, Package, ShoppingBag, Users, UserPlus, BarChart3, Tag, FileText, Truck, AlertTriangle, Upload, Download, Boxes } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AnalyticsAdmin from "@/components/admin/AnalyticsAdmin";
import CouponsAdmin from "@/components/admin/CouponsAdmin";
import CustomersAdmin from "@/components/admin/CustomersAdmin";
import { openInvoice, downloadInvoicePdf } from "@/lib/invoice";

interface ProductRow {
  id: string; slug: string; name: string; description: string | null;
  price: number; original_price: number | null; image: string | null;
  category: string; stock: number; rating: number | null; reviews: number | null;
  sizes: string[] | null; colors: any;
  best_seller: boolean | null; trending: boolean | null; new_arrival: boolean | null;
  active: boolean;
}
interface OrderRow {
  id: string; user_id: string; status: string; total: number;
  payment_method: string; full_name: string; phone: string;
  city: string; pincode: string; created_at: string;
  invoice_number: string | null; tracking_id: string | null; tracking_url: string | null;
}
interface RoleRow { id: string; user_id: string; role: string; }

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const CATEGORIES = ["men", "women", "footwear", "moringa", "accessories", "kids"];
const LOW_STOCK_THRESHOLD = 5;

const Admin = () => {
  const { user } = useAuth();
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => { document.title = "Admin Dashboard — ANITROH STORE"; }, []);

  useEffect(() => {
    supabase.from("products").select("id", { count: "exact", head: true }).lte("stock", LOW_STOCK_THRESHOLD)
      .then(({ count }) => setLowStockCount(count || 0));
  }, []);

  return (
    <div className="container-x py-12 max-w-7xl">
      <Link to="/account" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft size={16} /> Back to account
      </Link>
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <h1 className="font-display text-4xl font-bold flex items-center gap-3">
          <ShieldCheck className="text-accent" /> Admin Dashboard
        </h1>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/inventory"><Boxes size={16} className="mr-2" />Inventory</Link>
          </Button>
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 border border-destructive/50 bg-destructive/5 text-destructive rounded text-sm">
              <AlertTriangle size={16} />
              <span><strong>{lowStockCount}</strong> low stock</span>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="analytics">
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="analytics"><BarChart3 size={16} className="mr-2" />Analytics</TabsTrigger>
          <TabsTrigger value="products"><Package size={16} className="mr-2" />Products</TabsTrigger>
          <TabsTrigger value="orders"><ShoppingBag size={16} className="mr-2" />Orders</TabsTrigger>
          <TabsTrigger value="customers"><Users size={16} className="mr-2" />Customers</TabsTrigger>
          <TabsTrigger value="coupons"><Tag size={16} className="mr-2" />Coupons</TabsTrigger>
          <TabsTrigger value="team"><UserPlus size={16} className="mr-2" />Team</TabsTrigger>
          <TabsTrigger value="roles"><ShieldCheck size={16} className="mr-2" />Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics"><AnalyticsAdmin /></TabsContent>
        <TabsContent value="products"><ProductsAdmin /></TabsContent>
        <TabsContent value="orders"><OrdersAdmin /></TabsContent>
        <TabsContent value="customers"><CustomersAdmin /></TabsContent>
        <TabsContent value="coupons"><CouponsAdmin /></TabsContent>
        <TabsContent value="team"><TeamAdmin /></TabsContent>
        <TabsContent value="roles"><RolesAdmin currentUserId={user?.id} /></TabsContent>
      </Tabs>
    </div>
  );
};

/* ---------------- PRODUCTS ---------------- */
const emptyProduct: Partial<ProductRow> = {
  slug: "", name: "", description: "", price: 0, original_price: null,
  image: "", category: "men", stock: 0, sizes: [], colors: [],
  best_seller: false, trending: false, new_arrival: false, active: true,
};

const ProductsAdmin = () => {
  const [list, setList] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<ProductRow> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setList((data as unknown as ProductRow[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const startNew = () => { setEditing({ ...emptyProduct }); setDialogOpen(true); };
  const startEdit = (p: ProductRow) => { setEditing({ ...p }); setDialogOpen(true); };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    const fd = new FormData(e.currentTarget);
    const sizesStr = String(fd.get("sizes") || "").trim();
    const colorsStr = String(fd.get("colors") || "").trim();
    const payload: any = {
      slug: String(fd.get("slug") || "").trim(),
      name: String(fd.get("name") || "").trim(),
      description: String(fd.get("description") || ""),
      price: Number(fd.get("price") || 0),
      original_price: fd.get("original_price") ? Number(fd.get("original_price")) : null,
      image: String(fd.get("image") || ""),
      category: String(fd.get("category") || "men"),
      stock: Number(fd.get("stock") || 0),
      sizes: sizesStr ? sizesStr.split(",").map(s => s.trim()).filter(Boolean) : [],
      colors: colorsStr ? colorsStr.split(",").map(c => c.trim()).filter(Boolean) : [],
      best_seller: fd.get("best_seller") === "on",
      trending: fd.get("trending") === "on",
      new_arrival: fd.get("new_arrival") === "on",
      active: fd.get("active") === "on",
    };

    let error;
    if (editing.id) {
      ({ error } = await supabase.from("products").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Product updated" : "Product created");
    setDialogOpen(false);
    setEditing(null);
    load();
  };

  return (
    <section className="border border-border p-6 rounded-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-xl font-semibold">Products ({list.length})</h2>
        <Button variant="hero" onClick={startNew}><Plus size={16} className="mr-2" />Add Product</Button>
      </div>

      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="space-y-2">
          {list.map(p => (
            <div key={p.id} className="flex items-center gap-4 p-3 border border-border rounded-sm">
              {p.image && <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-sm" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">/{p.slug} · {p.category} · stock: {p.stock}{p.stock <= LOW_STOCK_THRESHOLD && <span className="text-destructive font-semibold ml-1">⚠ low</span>}</p>
              </div>
              <p className="font-display font-bold">₹{Number(p.price).toLocaleString()}</p>
              <span className={`text-xs px-2 py-0.5 rounded ${p.active ? "bg-green-100 text-green-700" : "bg-muted"}`}>
                {p.active ? "active" : "hidden"}
              </span>
              <Button size="icon" variant="ghost" onClick={() => startEdit(p)}><Pencil size={16} /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 size={16} className="text-destructive" /></Button>
            </div>
          ))}
          {!list.length && <p className="text-muted-foreground text-sm">No products yet.</p>}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Product" : "New Product"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Name</Label><Input name="name" defaultValue={editing.name || ""} required /></div>
                <div><Label>Slug</Label><Input name="slug" defaultValue={editing.slug || ""} required pattern="[a-z0-9-]+" /></div>
              </div>
              <div><Label>Description</Label><Textarea name="description" defaultValue={editing.description || ""} rows={3} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Price (₹)</Label><Input name="price" type="number" step="0.01" defaultValue={editing.price ?? 0} required /></div>
                <div><Label>Original Price</Label><Input name="original_price" type="number" step="0.01" defaultValue={editing.original_price ?? ""} /></div>
                <div><Label>Stock</Label><Input name="stock" type="number" defaultValue={editing.stock ?? 0} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Category</Label>
                  <Select name="category" defaultValue={editing.category || "men"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Product Image</Label>
                  <ImageUpload
                    value={editing.image || ""}
                    onChange={url => setEditing(prev => prev ? { ...prev, image: url } : prev)}
                  />
                  <input type="hidden" name="image" value={editing.image || ""} />
                </div>
              </div>
              <div><Label>Sizes (comma-separated)</Label><Input name="sizes" defaultValue={(editing.sizes || []).join(", ")} placeholder="S, M, L, XL" /></div>
               <div>
                 <Label>Colors (comma-separated)</Label>

                  <Input
                     name="colors"
                     defaultValue={(editing.colors || []).join(", ")}
                     placeholder="Black, Brown, White"
                     />
                </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={editing.active ?? true} />Active</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="best_seller" defaultChecked={!!editing.best_seller} />Best Seller</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="trending" defaultChecked={!!editing.trending} />Trending</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="new_arrival" defaultChecked={!!editing.new_arrival} />New Arrival</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" variant="hero">{editing.id ? "Save Changes" : "Create"}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

/* ---------------- IMAGE UPLOAD ---------------- */
const ImageUpload = ({ value, onChange }: { value: string; onChange: (url: string) => void }) => {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, {
      cacheControl: "3600", upsert: false,
    });
    setUploading(false);
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    onChange(data.publicUrl);
    toast.success("Image uploaded");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={value} onChange={e => onChange(e.target.value)} placeholder="Upload or paste URL" />
        <label className="inline-flex items-center justify-center px-3 border border-input rounded-md cursor-pointer hover:bg-secondary text-sm">
          <Upload size={14} className="mr-1" />{uploading ? "..." : "Upload"}
          <input type="file" accept="image/*" className="hidden" disabled={uploading}
            onChange={e => e.target.files?.[0] && upload(e.target.files[0])} />
        </label>
      </div>
      {value && <img src={value} alt="preview" className="w-24 h-24 object-cover rounded border border-border" />}
    </div>
  );
};

/* ---------------- ORDERS ---------------- */
const OrdersAdmin = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTracking, setEditingTracking] = useState<OrderRow | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as OrderRow[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order updated");
    load();
  };

  const saveTracking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTracking) return;
    const fd = new FormData(e.currentTarget);
   const { error } = await supabase.from("orders").update({
   tracking_id: String(fd.get("tracking_id") || "") || null,
   tracking_url: String(fd.get("tracking_url") || "") || null,
   status: "shipped",
}).eq("id", editingTracking.id);
    if (error) return toast.error(error.message);
    toast.success("Tracking saved");
    setEditingTracking(null);
    load();
  };

  const filtered = statusFilter === "all" ? orders : orders.filter(o => o.status === statusFilter);

  return (
    <section className="border border-border p-6 rounded-sm">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h2 className="font-display text-xl font-semibold">Orders ({filtered.length})</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="space-y-2">
          {filtered.map(o => (
            <div key={o.id} className="flex flex-wrap items-center gap-3 p-3 border border-border rounded-sm text-sm">
              <div className="flex-1 min-w-48">
                <p className="font-mono text-xs font-semibold">{o.invoice_number || `#${o.id.slice(0, 8).toUpperCase()}`}</p>
                <p className="text-xs text-muted-foreground">{o.full_name} · {o.phone}</p>
                <p className="text-xs text-muted-foreground">{o.city} · {o.pincode}</p>
                {o.tracking_id && <p className="text-xs text-accent">📦 {o.tracking_id}</p>}
              </div>
              <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</div>
              <p className="font-display font-bold">₹{Number(o.total).toLocaleString()}</p>
              <span className="text-xs uppercase px-2 py-0.5 bg-secondary rounded">{o.payment_method}</span>
              <Select value={o.status} onValueChange={v => updateStatus(o.id, v)}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={() => setEditingTracking(o)}>
                <Truck size={14} className="mr-1" />Tracking
              </Button>
              <Button size="sm" variant="outline" onClick={() => openInvoice(o.id)}>
                <FileText size={14} className="mr-1" />Invoice
              </Button>
              <Button size="sm" variant="outline" onClick={() => downloadInvoicePdf(o.id)}>
                <Download size={14} className="mr-1" />PDF
              </Button>
            </div>
          ))}
          {!filtered.length && <p className="text-muted-foreground text-sm">No orders found.</p>}
        </div>
      )}

      <Dialog open={!!editingTracking} onOpenChange={(o) => !o && setEditingTracking(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update Tracking — {editingTracking?.invoice_number}</DialogTitle></DialogHeader>
          {editingTracking && (
            <form onSubmit={saveTracking} className="space-y-4">
              <div><Label>Tracking ID</Label><Input name="tracking_id" defaultValue={editingTracking.tracking_id || ""} placeholder="e.g. ABC123456789" /></div>
              <div><Label>Tracking URL</Label><Input name="tracking_url" type="url" defaultValue={editingTracking.tracking_url || ""} placeholder="https://courier.com/track/..." /></div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingTracking(null)}>Cancel</Button>
                <Button type="submit" variant="hero">Save Tracking</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

/* ---------------- ROLES ---------------- */
const RolesAdmin = ({ currentUserId }: { currentUserId?: string }) => {
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("user_roles").select("*").order("created_at", { ascending: false });
    setRoles((data as RoleRow[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const grantAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const userId = String(fd.get("user_id") || "").trim();
    if (!userId) return;
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (error) return toast.error(error.message);
    toast.success("Admin role granted");
    (e.currentTarget as HTMLFormElement).reset();
    load();
  };

  const revoke = async (id: string) => {
    if (!confirm("Revoke this role?")) return;
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Revoked");
    load();
  };

  return (
    <>
      <section className="border border-border p-6 rounded-sm mb-6">
        <h2 className="font-display text-xl font-semibold mb-4">Grant Admin Role</h2>
        <form onSubmit={grantAdmin} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-64">
            <Label>User ID (UUID)</Label>
            <Input name="user_id" placeholder="00000000-0000-0000-0000-000000000000" required />
          </div>
          <Button type="submit" variant="hero">Grant Admin</Button>
        </form>
        <p className="text-xs text-muted-foreground mt-3">Your user ID: <code className="font-mono">{currentUserId}</code></p>
      </section>

      <section className="border border-border p-6 rounded-sm">
        <h2 className="font-display text-xl font-semibold mb-4">All User Roles</h2>
        {loading ? <p className="text-muted-foreground">Loading...</p> : (
          <div className="space-y-2">
            {roles.map(r => (
              <div key={r.id} className="flex items-center justify-between text-sm border-b border-border py-2 gap-2">
                <code className="font-mono text-xs truncate">{r.user_id}</code>
                <span className={`px-2 py-0.5 rounded text-xs ${r.role === "admin" ? "bg-accent/20 text-accent" : "bg-secondary"}`}>{r.role}</span>
                <Button size="icon" variant="ghost" onClick={() => revoke(r.id)}>
                  <Trash2 size={14} className="text-destructive" />
                </Button>
              </div>
            ))}
            {!roles.length && <p className="text-muted-foreground text-sm">No roles found.</p>}
          </div>
        )}
      </section>
    </>
  );
};

/* ---------------- TEAM (CREATE USERS) ---------------- */
const TeamAdmin = () => {
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<{ email: string; password: string; role: string } | null>(null);

  const create = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const full_name = String(fd.get("full_name") || "");
    const role = String(fd.get("role") || "customer");

    const { data, error } = await supabase.functions.invoke("admin-create-user", {
      body: { email, password, full_name, role },
    });
    setSubmitting(false);

    if (error || (data && data.error)) {
      return toast.error((data && data.error) || error?.message || "Failed to create user");
    }
    toast.success(`Account created for ${email}`);
    setCreated({ email, password, role });
    (e.target as HTMLFormElement).reset();
  };

  const genPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$";
    let p = "";
    for (let i = 0; i < 12; i++) p += chars[Math.floor(Math.random() * chars.length)];
    const input = document.querySelector<HTMLInputElement>('input[name="password"]');
    if (input) input.value = p;
  };

  return (
    <section className="border border-border p-6 rounded-sm max-w-2xl">
      <div className="flex items-start gap-3 mb-6">
        <UserPlus className="text-accent" />
        <div>
          <h2 className="font-display text-xl font-semibold">Create Team Account</h2>
          <p className="text-sm text-muted-foreground">
            Add a teammate by setting their email & password. Choose <strong>Admin</strong> for full access
            (manage products, orders, team) or <strong>Customer</strong> for shopping-only.
          </p>
        </div>
      </div>

      <form onSubmit={create} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label>Full name</Label><Input name="full_name" placeholder="Jane Doe" /></div>
          <div>
            <Label>Role</Label>
            <Select name="role" defaultValue="customer">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin (full access)</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div><Label>Email</Label><Input name="email" type="email" required placeholder="teammate@example.com" /></div>
        <div>
          <Label>Password</Label>
          <div className="flex gap-2">
            <Input name="password" type="text" required minLength={8} placeholder="At least 8 characters" />
            <Button type="button" variant="outline" onClick={genPassword}>Generate</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Share these credentials with your teammate over a secure channel.</p>
        </div>
        <Button type="submit" variant="hero" disabled={submitting}>
          {submitting ? "Creating..." : "Create Account"}
        </Button>
      </form>

      {created && (
        <div className="mt-6 p-4 bg-secondary rounded-sm border border-border">
          <p className="text-sm font-semibold mb-2">✅ Account created — share these credentials:</p>
          <div className="font-mono text-xs space-y-1">
            <p>Email: <span className="text-accent">{created.email}</span></p>
            <p>Password: <span className="text-accent">{created.password}</span></p>
            <p>Role: <span className="text-accent uppercase">{created.role}</span></p>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            They can sign in at <code>/auth</code> immediately. Tell them to change the password from Account → Profile after first login.
          </p>
        </div>
      )}
    </section>
  );
};

export default Admin;

