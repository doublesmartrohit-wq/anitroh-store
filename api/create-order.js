
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {

  try {

    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed",
      });
    }

    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        error: "Amount required",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.status(200).json(order);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}
