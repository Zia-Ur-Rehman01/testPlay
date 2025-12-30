import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// Create SMTP transporter
const createTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: "info@schenigotravel.co.uk",
      pass: "password", // <-- CHANGE THIS
    },
  });

// Email HTML template
const buildHtmlTemplate = (data) => `
  <div style="font-family:Arial;padding:20px;background:#f7f7f7;">
    <h2 style="color:#2A918F;">New Inquiry Received</h2>

    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>
    <p><strong>Nationality:</strong> ${data.nationality}</p>
    <p><strong>Service:</strong> ${data.service}</p>
    <p><strong>Best Time to Call:</strong> ${data.best_time_to_call}</p>
  </div>
`;

// Route handler
const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const transporter = createTransporter();

  try {
    await transporter.sendMail({
      from: req.body.email,
      to: "info@schenigotravel.co.uk",
      subject: `New Inquiry from ${req.body.name}`,
      html: buildHtmlTemplate(req.body),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email sending failed:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
};

// API Endpoint
app.post("/send-email", handler);

// Back4App uses PORT provided by environment
const PORT = process.env.PORT || 4004;

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
