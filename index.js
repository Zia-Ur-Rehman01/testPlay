import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* -------------------- Middlewares -------------------- */
app.use(express.json());

app.use(
  cors({
    origin: '*',
    methods: ["GET","POST"],
  })
);

/* -------------------- SMTP Transporter -------------------- */
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, 
  },
});

/* -------------------- Email Template -------------------- */
const buildHtmlTemplate = (data) => `
  <div style="font-family:Arial,sans-serif;padding:20px;background:#f7f7f7">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;padding:20px">
      <h2 style="color:#2A918F;margin-bottom:20px">New Inquiry Received</h2>

      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>
      <p><strong>Nationality:</strong> ${data.nationality}</p>
      <p><strong>Service:</strong> ${data.service}</p>
      <p>
        <strong>Best Time to Call:</strong>
        ${new Date(data.best_time_to_call).toLocaleString()}
      </p>

      <hr style="margin:20px 0" />
      <p style="font-size:12px;color:#777">
        This inquiry was submitted from the website contact form.
      </p>
    </div>
  </div>
`;

/* -------------------- API Route -------------------- */
// test route
app.get('/test',async(req,res) => {
return res.json({
  success:true,
  message:`Test is successfull.`
})
})

app.post("/send-email", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      whatsapp,
      nationality,
      service,
      best_time_to_call,
    } = req.body;

    // Basic validation (backend safety)
    if (
      !name ||
      !email ||
      !phone ||
      !whatsapp ||
      !nationality ||
      !service ||
      !best_time_to_call
    ) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    await transporter.sendMail({
      from: `"Website Inquiry" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `New Inquiry from ${name}`,
      html: buildHtmlTemplate({
        name,
        email,
        phone,
        whatsapp,
        nationality,
        service,
        best_time_to_call,
      }),
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("❌ Email sending failed:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to send email",
    });
  }
});

/* -------------------- Server -------------------- */
const PORT = process.env.PORT || 4004;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
