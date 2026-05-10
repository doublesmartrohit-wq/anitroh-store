import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ShoppingBag, IndianRupee, Users, AlertTriangle, TrendingUp } from "lucide-react";

interface Stats {
  revenue: number;
  orders: number;
  customers: number;
  lowStock: number;
}

const AnalyticsAdmin = () => {
  const [stats, setStats] = useState<Stats>({ revenue: 0, orders: 0, customers: 0, lowStock: 0 });
  const [topProducts, setTopProducts] = useState<{ name: string; qty: number; revenue: number }[]>([]);
  const [topCustomers, setTopCustomers] = useState<{ name: string; orders: number; spent: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: orders }, { data: items }, { data: lowProds }, { data: customers }] = await Promise.all([
        supabase.from("orders").select("id,total,full_name,user_id,status"),
        supabase.from("order_items").select("name,price,quantity"),
        supabase.from("products").select("id,stock").lte("stock", 5),
        supabase.from("profiles").select("user_id"),
      ]);

      const validOrders = (orders || []).filter(o => o.status !== "cancelled");
      const revenue = validOrders.reduce((s, o) => s + Number(o.total || 0), 0);

      const productMap: Record<string, { qty: number; revenue: number }> = {};
      (items || []).forEach(i => {
        const k = i.name;
        if (!productMap[k]) productMap[k] = { qty: 0, revenue: 0 };
        productMap[k].qty += i.quantity;
        productMap[k].revenue += Number(i.price) * i.quantity;
      });
      const top = Object.entries(productMap).map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => b.qty - a.qty).slice(0, 5);

      const custMap: Record<string, { name: string; orders: number; spent: number }> = {};
      validOrders.forEach(o => {
        if (!custMap[o.user_id]) custMap[o.user_id] = { name: o.full_name, orders: 0, spent: 0 };
        custMap[o.user_id].orders += 1;
        custMap[o.user_id].spent += Number(o.total || 0);
      });
      const topC = Object.values(custMap).sort((a, b) => b.spent - a.spent).slice(0, 5);

      setStats({
        revenue,
        orders: validOrders.length,
        customers: (customers || []).length,
        lowStock: (lowProds || []).length,
      });
      setTopProducts(top);
      setTopCustomers(topC);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading analytics...</p>;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<IndianRupee />} label="Total Revenue" value={`₹${stats.revenue.toLocaleString("en-IN")}`} />
        <StatCard icon={<ShoppingBag />} label="Total Orders" value={stats.orders.toString()} />
        <StatCard icon={<Users />} label="Customers" value={stats.customers.toString()} />
        <StatCard icon={<AlertTriangle />} label="Low Stock (≤5)" value={stats.lowStock.toString()} accent={stats.lowStock > 0} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2"><TrendingUp size={18} />Best Selling Products</h3>
          {topProducts.length === 0 ? <p className="text-sm text-muted-foreground">No sales yet.</p> : (
            <div className="space-y-2">
              {topProducts.map((p, i) => (
                <div key={i} className="flex justify-between text-sm border-b border-border py-2">
                  <span className="truncate flex-1">{i + 1}. {p.name}</span>
                  <span className="text-muted-foreground mx-3">{p.qty} sold</span>
                  <span className="font-semibold">₹{p.revenue.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2"><Users size={18} />Top Customers</h3>
          {topCustomers.length === 0 ? <p className="text-sm text-muted-foreground">No customers yet.</p> : (
            <div className="space-y-2">
              {topCustomers.map((c, i) => (
                <div key={i} className="flex justify-between text-sm border-b border-border py-2">
                  <span className="truncate flex-1">{i + 1}. {c.name}</span>
                  <span className="text-muted-foreground mx-3">{c.orders} order{c.orders !== 1 ? "s" : ""}</span>
                  <span className="font-semibold">₹{c.spent.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) => (
  <Card className={`p-5 ${accent ? "border-destructive" : ""}`}>
    <div className={`flex items-center gap-2 text-xs uppercase tracking-wider mb-2 ${accent ? "text-destructive" : "text-muted-foreground"}`}>
      <span className="opacity-70">{icon}</span>{label}
    </div>
    <div className="font-display text-2xl font-bold">{value}</div>
  </Card>
);

export default AnalyticsAdmin;
