import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

interface CustomerStats {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  orders: number;
  spent: number;
  lastOrder?: string;
}

const CustomersAdmin = () => {
  const [list, setList] = useState<CustomerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const [{ data: profiles }, { data: orders }] = await Promise.all([
        supabase.from("profiles").select("user_id,full_name,phone,city,state"),
        supabase.from("orders").select("user_id,total,created_at,status"),
      ]);

      const map = new Map<string, CustomerStats>();
      (profiles || []).forEach(p => {
        map.set(p.user_id, { ...p, orders: 0, spent: 0 });
      });
      (orders || []).filter(o => o.status !== "cancelled").forEach(o => {
        const c = map.get(o.user_id) || { user_id: o.user_id, full_name: null, phone: null, city: null, state: null, orders: 0, spent: 0 };
        c.orders += 1;
        c.spent += Number(o.total || 0);
        if (!c.lastOrder || o.created_at > c.lastOrder) c.lastOrder = o.created_at;
        map.set(o.user_id, c);
      });
      const arr = Array.from(map.values()).sort((a, b) => b.spent - a.spent);
      setList(arr);
      setLoading(false);
    })();
  }, []);

  const filtered = list.filter(c =>
    !search || (c.full_name || "").toLowerCase().includes(search.toLowerCase()) || (c.phone || "").includes(search)
  );

  return (
    <section className="border border-border p-6 rounded-sm">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2"><Users size={18} />Customers ({list.length})</h2>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className="border border-border rounded px-3 py-1 text-sm bg-background"
        />
      </div>
      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-3">Customer</th>
                <th className="py-2 pr-3">Phone</th>
                <th className="py-2 pr-3">Location</th>
                <th className="py-2 pr-3 text-center">Orders</th>
                <th className="py-2 pr-3 text-right">Total Spent</th>
                <th className="py-2 pr-3">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.user_id} className="border-b border-border/60 hover:bg-secondary/40">
                  <td className="py-2 pr-3 font-medium">{c.full_name || <span className="text-muted-foreground italic">No name</span>}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{c.phone || "—"}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{[c.city, c.state].filter(Boolean).join(", ") || "—"}</td>
                  <td className="py-2 pr-3 text-center">{c.orders}</td>
                  <td className="py-2 pr-3 text-right font-semibold">₹{c.spent.toLocaleString("en-IN")}</td>
                  <td className="py-2 pr-3 text-xs text-muted-foreground">{c.lastOrder ? new Date(c.lastOrder).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default CustomersAdmin;
