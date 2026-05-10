import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "rohitaipowered@gmail.com",
      subject: "ANITROH Test Email",
      html: `
        <h1>ANITROH STORE</h1>
        <p>Email system working successfully.</p>
      `,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
}