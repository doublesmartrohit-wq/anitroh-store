import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, AlertTriangle, Boxes, Save, Search, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface Row {
  id: string; name: string; slug: string; category: string;
  stock: number; price: number; image: string | null; active: boolean;
}

const LOW = 5;
const OUT = 0;

const AdminInventory = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [edits, setEdits] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { document.title = "Inventory — Admin Dashboard"; }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("id,name,slug,category,stock,price,image,active").order("stock", { ascending: true });
    setRows((data as Row[]) || []);
    setEdits({});
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => rows.filter(r => {
    if (search && !`${r.name} ${r.slug} ${r.category}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "low") return r.stock > OUT && r.stock <= LOW;
    if (filter === "out") return r.stock <= OUT;
    if (filter === "ok") return r.stock > LOW;
    return true;
  }), [rows, search, filter]);

  const stats = useMemo(() => ({
    total: rows.length,
    out: rows.filter(r => r.stock <= OUT).length,
    low: rows.filter(r => r.stock > OUT && r.stock <= LOW).length,
    units: rows.reduce((s, r) => s + (r.stock || 0), 0),
    value: rows.reduce((s, r) => s + (Number(r.stock) || 0) * Number(r.price || 0), 0),
  }), [rows]);

  const setStock = (id: string, val: number) => setEdits(p => ({ ...p, [id]: val }));

  const saveAll = async () => {
    const entries = Object.entries(edits).filter(([id, v]) => {
      const r = rows.find(x => x.id === id); return r && r.stock !== v;
    });
    if (!entries.length) return toast.info("No changes");
    setSaving(true);
    let ok = 0;
    for (const [id, v] of entries) {
      const { error } = await supabase.from("products").update({ stock: v }).eq("id", id);
      if (!error) ok++;
    }
    setSaving(false);
    toast.success(`Updated ${ok} product${ok !== 1 ? "s" : ""}`);
    load();
  };

  const adjust = async (id: string, delta: number) => {
    const r = rows.find(x => x.id === id); if (!r) return;
    const next = Math.max(0, (edits[id] ?? r.stock) + delta);
    setStock(id, next);
  };

  return (
    <div className="container-x py-12 max-w-7xl">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft size={16} /> Back to admin dashboard
      </Link>

      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <h1 className="font-display text-4xl font-bold flex items-center gap-3">
          <Boxes className="text-accent" /> Inventory Control
        </h1>
        <Button variant="hero" onClick={saveAll} disabled={saving || !Object.keys(edits).length}>
          <Save size={16} className="mr-2" />{saving ? "Saving..." : `Save changes (${Object.keys(edits).filter(id => rows.find(r => r.id === id)?.stock !== edits[id]).length})`}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <Stat label="Products" value={stats.total} />
        <Stat label="Out of stock" value={stats.out} tone={stats.out ? "danger" : undefined} icon={<AlertTriangle size={14} />} />
        <Stat label="Low stock" value={stats.low} tone={stats.low ? "warn" : undefined} icon={<TrendingDown size={14} />} />
        <Stat label="Total units" value={stats.units.toLocaleString()} />
        <Stat label="Stock value" value={`₹${Math.round(stats.value).toLocaleString("en-IN")}`} />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-60">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-9" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="out">Out of stock</SelectItem>
            <SelectItem value="low">Low stock</SelectItem>
            <SelectItem value="ok">In stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <section className="border border-border rounded-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-3 p-3 bg-secondary/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <div className="col-span-5">Product</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-3 text-center">Stock</div>
        </div>
        {loading ? (
          <p className="p-6 text-center text-muted-foreground">Loading inventory...</p>
        ) : !filtered.length ? (
          <p className="p-6 text-center text-muted-foreground">No products match.</p>
        ) : filtered.map(r => {
          const current = edits[r.id] ?? r.stock;
          const dirty = edits[r.id] !== undefined && edits[r.id] !== r.stock;
          const tone = current <= OUT ? "border-l-destructive" : current <= LOW ? "border-l-amber-500" : "border-l-green-500";
          return (
            <div key={r.id} className={`grid grid-cols-12 gap-3 p-3 border-t border-border border-l-4 ${tone} items-center text-sm ${dirty ? "bg-accent/5" : ""}`}>
              <div className="col-span-12 md:col-span-5 flex items-center gap-3 min-w-0">
                {r.image ? <img src={r.image} alt={r.name} className="w-10 h-10 object-cover rounded-sm flex-shrink-0" /> : <div className="w-10 h-10 bg-muted rounded-sm flex-shrink-0" />}
                <div className="min-w-0">
                  <p className="font-medium truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground truncate">/{r.slug}{!r.active && " · hidden"}</p>
                </div>
              </div>
              <div className="col-span-4 md:col-span-2 text-xs uppercase text-muted-foreground">{r.category}</div>
              <div className="col-span-4 md:col-span-2 text-right font-display font-semibold">₹{Number(r.price).toLocaleString()}</div>
              <div className="col-span-4 md:col-span-3 flex items-center justify-end md:justify-center gap-1">
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => adjust(r.id, -1)}>−</Button>
                <Input type="number" value={current} onChange={e => setStock(r.id, Math.max(0, Number(e.target.value) || 0))} className="w-20 h-8 text-center" />
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => adjust(r.id, 1)}>+</Button>
                <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => adjust(r.id, 10)}>+10</Button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

const Stat = ({ label, value, tone, icon }: { label: string; value: string | number; tone?: "danger" | "warn"; icon?: React.ReactNode }) => (
  <div className={`p-4 border rounded-sm ${tone === "danger" ? "border-destructive/40 bg-destructive/5" : tone === "warn" ? "border-amber-500/40 bg-amber-500/5" : "border-border"}`}>
    <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">{icon}{label}</p>
    <p className="font-display text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default AdminInventory;
