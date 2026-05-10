import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const {
      email,
      full_name,
      order_id,
      total,
    } = req.body;

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: `Order Confirmed — ${order_id}`,
      html: `
        <div style="font-family:Arial;padding:24px;">
          <h1>ANITROH STORE</h1>

          <p>Hi ${full_name},</p>

          <p>Your order has been confirmed successfully.</p>

          <p><strong>Order ID:</strong> ${order_id}</p>

          <p><strong>Total:</strong> ₹${total}</p>

          <p>Thank you for shopping with ANITROH STORE.</p>
        </div>
      `,
    });

    return res.status(200).json(data);

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error,
    });
  }
}