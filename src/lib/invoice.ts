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

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]!));

export const generateInvoiceHtml = (order: OrderRecord, items: ItemRecord[]) => {
  const inv =
    order.invoice_number ||
    `INV-${order.id.slice(0, 8).toUpperCase()}`;

  const date = new Date(order.created_at).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const rows = items.map(i => `
    <tr>
      <td>
        <div style="font-weight:500;color:#111">
          ${escapeHtml(i.name)}
        </div>

        ${
          i.size || i.color
            ? `
          <div style="margin-top:6px;color:#888;font-size:12px">
            ${[i.size, i.color].filter(Boolean).join(" · ")}
          </div>
        `
            : ""
        }
      </td>

      <td style="text-align:center">
        ${i.quantity}
      </td>

      <td style="text-align:right">
        ₹${Number(i.price).toLocaleString("en-IN")}
      </td>

      <td style="text-align:right;font-weight:500">
        ₹${(Number(i.price) * i.quantity).toLocaleString("en-IN")}
      </td>
    </tr>
  `).join("");

  return `
<!doctype html>

<html>

<head>
<meta charset="utf-8">

<title>Invoice ${inv}</title>

<style>

*{
  box-sizing:border-box
}

body{
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif;
  margin:0;
  padding:48px;
  color:#111;
  background:#fafafa;
  line-height:1.6;
}

.wrap{
  max-width:820px;
  margin:auto;
  background:#fff;
  padding:48px;
  border:1px solid #ececec;
}

.head{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  padding-bottom:28px;
  border-bottom:1px solid #e8e8e8;
  margin-bottom:40px;
}

.brand{
  font-size:34px;
  font-weight:700;
  letter-spacing:-1px;
}

.tagline{
  color:#777;
  font-size:13px;
  margin-top:6px;
  letter-spacing:0.3px;
}

.muted{
  color:#666;
  font-size:13px;
}

h2{
  font-size:13px;
  font-weight:600;
  letter-spacing:0.2px;
  margin:0 0 14px;
  color:#111;
}

table{
  width:100%;
  border-collapse:collapse;
  margin-top:12px;
}

th{
  text-align:left;
  font-size:11px;
  color:#777;
  font-weight:600;
  padding:16px 12px;
  border-bottom:1px solid #ececec;
}

td{
  padding:20px 12px;
  border-bottom:1px solid #f1f1f1;
  font-size:14px;
  vertical-align:top;
}

.totals{
  margin-top:36px;
  margin-left:auto;
  width:320px;
}

.totals div{
  display:flex;
  justify-content:space-between;
  padding:10px 0;
  font-size:14px;
  color:#444;
}

.totals .grand{
  border-top:1px solid #111;
  margin-top:10px;
  padding-top:18px;
  font-size:22px;
  font-weight:700;
  color:#111;
}

.grid2{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:60px;
  margin-top:8px;
}

.badge{
  display:inline-block;
  padding:5px 12px;
  background:#f3f3f3;
  border:1px solid #e4e4e4;
  color:#111;
  border-radius:999px;
  font-size:11px;
  font-weight:600;
  letter-spacing:0.3px;
}

.tracking{
  margin-top:14px;
  padding:16px;
  background:#fafafa;
  border:1px solid #ececec;
  border-radius:10px;
}

.tracking a{
  color:#111;
  text-decoration:none;
  font-weight:500;
}

.footer{
  margin-top:70px;
  text-align:center;
  color:#777;
  font-size:12px;
  line-height:1.8;
}

@media print{
  .noprint{
    display:none
  }

  body{
    background:#fff;
    padding:0;
  }

  .wrap{
    border:none;
    padding:0;
  }
}

.btn{
  padding:12px 20px;
  background:#111;
  color:#fff;
  border:0;
  border-radius:999px;
  cursor:pointer;
  font-weight:500;
  font-size:13px;
}

</style>

</head>

<body>

<div class="wrap">

<div class="noprint" style="text-align:right;margin-bottom:20px">
  <button class="btn" onclick="window.print()">
    Print / Save PDF
  </button>
</div>

<div class="head">

  <div>
    <div class="brand">ANITROH.</div>

    <div class="tagline">
      Premium Fashion · Footwear · Wellness
    </div>
  </div>

  <div style="text-align:right">

    <div style="font-size:18px;font-weight:600">
      Invoice
    </div>

    <div class="muted">
      ${escapeHtml(inv)}
    </div>

    <div class="muted">
      ${date}
    </div>

    <div style="margin-top:10px">
      <span class="badge">
        ${escapeHtml(order.status)}
      </span>
    </div>

  </div>

</div>

<div class="grid2">

  <div>

    <h2>Bill To</h2>

    <div style="font-weight:600">
      ${escapeHtml(order.full_name)}
    </div>

    <div class="muted">
      ${escapeHtml(order.phone)}
    </div>

    <div class="muted">
      ${escapeHtml(order.address_line1)}
      ${
        order.address_line2
          ? ", " + escapeHtml(order.address_line2)
          : ""
      }
    </div>

    <div class="muted">
      ${escapeHtml(order.city)},
      ${escapeHtml(order.state)}
      -
      ${escapeHtml(order.pincode)}
    </div>

    <div class="muted">
      ${escapeHtml(order.country)}
    </div>

  </div>

  <div>

    <h2>Payment & Shipping</h2>

    <div class="tracking">

      <div class="muted">
        Payment:
        <strong style="color:#111;text-transform:uppercase">
          ${escapeHtml(order.payment_method)}
        </strong>
      </div>

      ${
        order.tracking_id
          ? `
        <div class="muted" style="margin-top:8px">
          Tracking ID:
          <strong style="color:#111">
            ${escapeHtml(order.tracking_id)}
          </strong>
        </div>
      `
          : ""
      }

      ${
        order.tracking_url
          ? `
        <div style="margin-top:10px">
          <a href="${escapeHtml(order.tracking_url)}">
            Track Shipment →
          </a>
        </div>
      `
          : ""
      }

    </div>

  </div>

</div>

<h2 style="margin-top:50px">
  Items
</h2>

<table>

<thead>

<tr>
  <th>Product</th>

  <th style="text-align:center">
    Qty
  </th>

  <th style="text-align:right">
    Price
  </th>

  <th style="text-align:right">
    Total
  </th>
</tr>

</thead>

<tbody>

${rows}

</tbody>

</table>

<div class="totals">

  <div>
    <span>Subtotal</span>

    <span>
      ₹${Number(order.subtotal).toLocaleString("en-IN")}
    </span>
  </div>

  ${
    Number(order.discount) > 0
      ? `
    <div>
      <span>Discount</span>

      <span>
        -₹${Number(order.discount).toLocaleString("en-IN")}
      </span>
    </div>
  `
      : ""
  }

  <div>

    <span>Shipping</span>

    <span>
      ${
        Number(order.shipping) === 0
          ? "FREE"
          : "₹" +
            Number(order.shipping).toLocaleString("en-IN")
      }
    </span>

  </div>

  <div class="grand">

    <span>Total</span>

    <span>
      ₹${Number(order.total).toLocaleString("en-IN")}
    </span>

  </div>

</div>

<div class="footer">

  <div>
    Crafted for modern living.
  </div>

  <div>
    Thank you for choosing ANITROH.
  </div>

</div>

</div>

</body>

</html>
`;
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
