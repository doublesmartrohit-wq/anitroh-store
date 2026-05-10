import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Plus, Tag } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order: number;
  max_uses: number | null;
  used_count: number;
  active: boolean;
  expires_at: string | null;
}

const CouponsAdmin = () => {
  const [list, setList] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setList((data as Coupon[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      code: String(fd.get("code") || "").trim().toUpperCase(),
      discount_type: String(fd.get("discount_type") || "percent"),
      discount_value: Number(fd.get("discount_value") || 0),
      min_order: Number(fd.get("min_order") || 0),
      max_uses: fd.get("max_uses") ? Number(fd.get("max_uses")) : null,
      expires_at: fd.get("expires_at") ? new Date(String(fd.get("expires_at"))).toISOString() : null,
      active: true,
    };
    if (!payload.code || !payload.discount_value) return toast.error("Code & discount required");
    const { error } = await supabase.from("coupons").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Coupon created");
    (e.target as HTMLFormElement).reset();
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const toggle = async (c: Coupon) => {
    const { error } = await supabase.from("coupons").update({ active: !c.active }).eq("id", c.id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="space-y-6">
      <section className="border border-border p-6 rounded-sm">
        <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2"><Plus size={18} />Create Coupon</h2>
        <form onSubmit={create} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div><Label>Code</Label><Input name="code" placeholder="SAVE20" required /></div>
          <div>
            <Label>Type</Label>
            <Select name="discount_type" defaultValue="percent">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">Percent (%)</SelectItem>
                <SelectItem value="fixed">Fixed (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Value</Label><Input name="discount_value" type="number" step="0.01" required /></div>
          <div><Label>Min order (₹)</Label><Input name="min_order" type="number" defaultValue="0" /></div>
          <div><Label>Max uses (optional)</Label><Input name="max_uses" type="number" /></div>
          <div><Label>Expires (optional)</Label><Input name="expires_at" type="date" /></div>
          <div className="sm:col-span-2 lg:col-span-3"><Button type="submit" variant="hero">Create Coupon</Button></div>
        </form>
      </section>

      <section className="border border-border p-6 rounded-sm">
        <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2"><Tag size={18} />All Coupons ({list.length})</h2>
        {loading ? <p className="text-muted-foreground">Loading...</p> : (
          <div className="space-y-2">
            {list.map(c => (
              <div key={c.id} className="flex flex-wrap items-center gap-3 p-3 border border-border rounded-sm text-sm">
                <code className="font-mono font-bold text-accent">{c.code}</code>
                <span>{c.discount_type === "percent" ? `${c.discount_value}% off` : `₹${c.discount_value} off`}</span>
                <span className="text-xs text-muted-foreground">Min ₹{c.min_order}</span>
                <span className="text-xs text-muted-foreground">Used: {c.used_count}{c.max_uses ? `/${c.max_uses}` : ""}</span>
                {c.expires_at && <span className="text-xs text-muted-foreground">Expires {new Date(c.expires_at).toLocaleDateString()}</span>}
                <div className="ml-auto flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => toggle(c)}>{c.active ? "Disable" : "Enable"}</Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(c.id)}><Trash2 size={16} className="text-destructive" /></Button>
                </div>
              </div>
            ))}
            {!list.length && <p className="text-muted-foreground text-sm">No coupons yet.</p>}
          </div>
        )}
      </section>
    </div>
  );
};

export default CouponsAdmin;
