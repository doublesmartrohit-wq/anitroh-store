import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, FileText, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { openInvoice, downloadInvoicePdf } from "@/lib/invoice";
import { Download } from "lucide-react";

interface OrderRow {
  id: string;
  status: string;
  total: number;
  payment_method: string;
  created_at: string;
  invoice_number: string | null;
  tracking_id: string | null;
  tracking_url: string | null;
}
interface OrderItem {
  id: string;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
}

const statusColor: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const OrdersList = ({ userId }: { userId?: string }) => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as OrderRow[]) || []);
        setLoading(false);
      });
  }, [userId]);

  const toggle = async (id: string) => {
    if (open === id) { setOpen(null); return; }
    setOpen(id);
    if (!items[id]) {
      const { data } = await supabase.from("order_items").select("*").eq("order_id", id);
      setItems(prev => ({ ...prev, [id]: (data as OrderItem[]) || [] }));
    }
  };

  if (loading) return <p className="text-muted-foreground py-8 text-center">Loading orders...</p>;

  if (!orders.length) {
    return (
      <div className="border border-border p-8 rounded-sm text-center text-muted-foreground">
        <Package size={32} className="mx-auto mb-3 opacity-50" />
        <p>You have no orders yet.</p>
        <Button asChild variant="outline" className="mt-4"><Link to="/">Start Shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map(o => (
        <div key={o.id} className="border border-border rounded-sm overflow-hidden">
          <button onClick={() => toggle(o.id)} className="w-full flex flex-wrap items-center justify-between gap-3 p-4 text-left hover:bg-secondary/50 transition">
            <div>
              <p className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
            </div>
            <span className={`px-2 py-1 text-xs rounded uppercase font-semibold ${statusColor[o.status] || ""}`}>{o.status}</span>
            <div className="text-right">
              <p className="font-display font-bold">₹{Number(o.total).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground uppercase">{o.payment_method}</p>
            </div>
          </button>
          {open === o.id && (
            <div className="border-t border-border p-4 bg-secondary/30 space-y-3">
              {(items[o.id] || []).map(it => (
                <div key={it.id} className="flex gap-3 text-sm">
                  {it.image && <img src={it.image} alt={it.name} className="w-12 h-14 object-cover rounded-sm" />}
                  <div className="flex-1">
                    <p className="font-medium">{it.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {it.quantity}{it.size ? ` · Size: ${it.size}` : ""}{it.color ? ` · ${it.color}` : ""}
                    </p>
                  </div>
                  <p className="font-semibold">₹{(Number(it.price) * it.quantity).toLocaleString()}</p>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                <Button size="sm" variant="outline" onClick={() => openInvoice(o.id)}>
                  <FileText size={14} className="mr-1" />Invoice {o.invoice_number || ""}
                </Button>
                <Button size="sm" variant="outline" onClick={() => downloadInvoicePdf(o.id)}>
                  <Download size={14} className="mr-1" />PDF
                </Button>
                {o.tracking_url && (
                  <Button asChild size="sm" variant="outline">
                    <a href={o.tracking_url} target="_blank" rel="noopener noreferrer"><Truck size={14} className="mr-1" />Track {o.tracking_id || ""}</a>
                  </Button>
                )}
                {o.tracking_id && !o.tracking_url && (
                  <span className="text-xs text-muted-foreground self-center">Tracking ID: <code>{o.tracking_id}</code></span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrdersList;
