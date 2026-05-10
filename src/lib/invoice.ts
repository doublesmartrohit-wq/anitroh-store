import { supabase } from "@/integrations/supabase/client";

interface OrderRecord {
  id: string;
  invoice_number: string | null;
  created_at: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  payment_method: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: string;
  tracking_id?: string | null;
  tracking_url?: string | null;
}

interface ItemRecord {
  name: string;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export const generateInvoiceHtml = (order: OrderRecord, items: ItemRecord[]) => {
  const inv = order.invoice_number || `INV-${order.id.slice(0, 8).toUpperCase()}`;
  const date = new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const rows = items.map(i => `
    <tr>
      <td>${escapeHtml(i.name)}${i.size || i.color ? `<br><small style="color:#888">${[i.size, i.color].filter(Boolean).join(" · ")}</small>` : ""}</td>
      <td style="text-align:center">${i.quantity}</td>
      <td style="text-align:right">₹${Number(i.price).toLocaleString("en-IN")}</td>
      <td style="text-align:right">₹${(Number(i.price) * i.quantity).toLocaleString("en-IN")}</td>
    </tr>`).join("");

  return `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${inv}</title>
<style>
  *{box-sizing:border-box}body{font-family:-apple-system,Segoe UI,Roboto,Inter,sans-serif;margin:0;padding:32px;color:#111;background:#fff}
  .wrap{max-width:780px;margin:auto}
  .head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #111;padding-bottom:16px;margin-bottom:24px}
  .brand{font-size:28px;font-weight:800;letter-spacing:1px}
  .muted{color:#666;font-size:13px}
  h2{font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:24px 0 8px}
  table{width:100%;border-collapse:collapse;margin-top:8px}
  th,td{padding:10px;border-bottom:1px solid #eee;font-size:14px;text-align:left}
  th{background:#fafafa;font-weight:600;text-transform:uppercase;font-size:11px;letter-spacing:1px;color:#555}
  .totals{margin-top:16px;margin-left:auto;width:280px}
  .totals div{display:flex;justify-content:space-between;padding:6px 0;font-size:14px}
  .totals .grand{border-top:2px solid #111;font-size:18px;font-weight:800;padding-top:10px;margin-top:6px}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:8px}
  .badge{display:inline-block;padding:3px 8px;background:#111;color:#fff;border-radius:3px;font-size:11px;text-transform:uppercase;letter-spacing:1px}
  @media print{.noprint{display:none}}
  .btn{padding:10px 18px;background:#111;color:#fff;border:0;border-radius:4px;cursor:pointer;font-weight:600}
</style></head><body><div class="wrap">
  <div class="noprint" style="text-align:right;margin-bottom:12px"><button class="btn" onclick="window.print()">Print / Save PDF</button></div>
  <div class="head">
    <div><div class="brand">ANITROH STORE</div><div class="muted">Premium Fashion · Footwear · Wellness</div></div>
    <div style="text-align:right">
      <div style="font-size:18px;font-weight:700">INVOICE</div>
      <div class="muted">${escapeHtml(inv)}</div>
      <div class="muted">${date}</div>
      <div style="margin-top:6px"><span class="badge">${escapeHtml(order.status)}</span></div>
    </div>
  </div>
  <div class="grid2">
    <div><h2>Bill To</h2>
      <div><strong>${escapeHtml(order.full_name)}</strong></div>
      <div class="muted">${escapeHtml(order.phone)}</div>
      <div class="muted">${escapeHtml(order.address_line1)}${order.address_line2 ? ", " + escapeHtml(order.address_line2) : ""}</div>
      <div class="muted">${escapeHtml(order.city)}, ${escapeHtml(order.state)} - ${escapeHtml(order.pincode)}</div>
      <div class="muted">${escapeHtml(order.country)}</div>
    </div>
    <div><h2>Payment & Shipping</h2>
      <div class="muted">Payment: <strong style="color:#111;text-transform:uppercase">${escapeHtml(order.payment_method)}</strong></div>
      ${order.tracking_id ? `<div class="muted">Tracking: <strong style="color:#111">${escapeHtml(order.tracking_id)}</strong></div>` : ""}
      ${order.tracking_url ? `<div class="muted"><a href="${escapeHtml(order.tracking_url)}">Track shipment →</a></div>` : ""}
    </div>
  </div>
  <h2>Items</h2>
  <table><thead><tr><th>Product</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead>
    <tbody>${rows}</tbody></table>
  <div class="totals">
    <div><span>Subtotal</span><span>₹${Number(order.subtotal).toLocaleString("en-IN")}</span></div>
    ${Number(order.discount) > 0 ? `<div><span>Discount</span><span>-₹${Number(order.discount).toLocaleString("en-IN")}</span></div>` : ""}
    <div><span>Shipping</span><span>${Number(order.shipping) === 0 ? "FREE" : "₹" + Number(order.shipping).toLocaleString("en-IN")}</span></div>
    <div class="grand"><span>Total</span><span>₹${Number(order.total).toLocaleString("en-IN")}</span></div>
  </div>
  <p class="muted" style="margin-top:32px;text-align:center;font-size:12px">Thank you for shopping with ANITROH STORE.</p>
</div></body></html>`;
};

const fetchInvoiceData = async (orderId: string) => {
  const { data: order } = await supabase.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) return null;
  const { data: items } = await supabase.from("order_items").select("name,price,quantity,size,color").eq("order_id", orderId);
  return { order: order as any as OrderRecord, items: (items as any as ItemRecord[]) || [] };
};

export const openInvoice = async (orderId: string) => {
  const data = await fetchInvoiceData(orderId);
  if (!data) return;
  const html = generateInvoiceHtml(data.order, data.items);
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
};

export const downloadInvoicePdf = async (orderId: string) => {
  const data = await fetchInvoiceData(orderId);
  if (!data) return;
  const { order, items } = data;
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const inv = order.invoice_number || `INV-${order.id.slice(0, 8).toUpperCase()}`;
  const date = new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const rupee = (n: number) => "Rs. " + Number(n).toLocaleString("en-IN");

  doc.setFont("helvetica", "bold"); doc.setFontSize(22);
  doc.text("ANITROH STORE", 40, 50);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(110);
  doc.text("Premium Fashion - Footwear - Wellness", 40, 66);

  doc.setTextColor(20); doc.setFont("helvetica", "bold"); doc.setFontSize(16);
  doc.text("INVOICE", W - 40, 50, { align: "right" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(110);
  doc.text(inv, W - 40, 66, { align: "right" });
  doc.text(date, W - 40, 80, { align: "right" });
  doc.text(`Status: ${order.status.toUpperCase()}`, W - 40, 94, { align: "right" });

  doc.setDrawColor(20); doc.setLineWidth(1.5); doc.line(40, 110, W - 40, 110);

  doc.setTextColor(20); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
  doc.text("BILL TO", 40, 135);
  doc.text("PAYMENT", W / 2, 135);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  const billLines = [
    order.full_name,
    order.phone,
    order.address_line1 + (order.address_line2 ? ", " + order.address_line2 : ""),
    `${order.city}, ${order.state} - ${order.pincode}`,
    order.country,
  ];
  billLines.forEach((l, i) => doc.text(l, 40, 152 + i * 14));
  doc.text(`Method: ${order.payment_method.toUpperCase()}`, W / 2, 152);
  if (order.tracking_id) doc.text(`Tracking: ${order.tracking_id}`, W / 2, 166);

  autoTable(doc, {
    startY: 240,
    head: [["Product", "Qty", "Price", "Total"]],
    body: items.map(i => [
      i.name + (i.size || i.color ? `\n${[i.size, i.color].filter(Boolean).join(" / ")}` : ""),
      String(i.quantity),
      rupee(i.price),
      rupee(Number(i.price) * i.quantity),
    ]),
    headStyles: { fillColor: [20, 20, 20], textColor: 255 },
    columnStyles: { 1: { halign: "center" }, 2: { halign: "right" }, 3: { halign: "right" } },
    margin: { left: 40, right: 40 },
  });

  let y = (doc as any).lastAutoTable.finalY + 20;
  const xLabel = W - 220, xVal = W - 40;
  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  doc.text("Subtotal", xLabel, y); doc.text(rupee(order.subtotal), xVal, y, { align: "right" }); y += 16;
  if (Number(order.discount) > 0) { doc.text("Discount", xLabel, y); doc.text("-" + rupee(order.discount), xVal, y, { align: "right" }); y += 16; }
  doc.text("Shipping", xLabel, y); doc.text(Number(order.shipping) === 0 ? "FREE" : rupee(order.shipping), xVal, y, { align: "right" }); y += 12;
  doc.setLineWidth(1); doc.line(xLabel, y, xVal, y); y += 18;
  doc.setFont("helvetica", "bold"); doc.setFontSize(13);
  doc.text("TOTAL", xLabel, y); doc.text(rupee(order.total), xVal, y, { align: "right" });

  doc.setFont("helvetica", "italic"); doc.setFontSize(9); doc.setTextColor(120);
  doc.text("Thank you for shopping with ANITROH STORE.", W / 2, doc.internal.pageSize.getHeight() - 30, { align: "center" });

  doc.save(`${inv}.pdf`);
};
