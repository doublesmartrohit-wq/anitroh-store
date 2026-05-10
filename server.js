import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-order-email", async (req, res) => {
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

          <p>
            <strong>Order ID:</strong> ${order_id}
          </p>

          <p>
            <strong>Total:</strong> ₹${total}
          </p>

          <p>
            Thank you for shopping with ANITROH STORE.
          </p>
        </div>
      `,
    });

    res.json(data);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error,
    });
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});