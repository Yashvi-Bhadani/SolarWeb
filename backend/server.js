import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "contact.db");

async function openDatabase() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS contact_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS solar_consultations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      location TEXT NOT NULL,
      roof_type TEXT NOT NULL,
      roof_size TEXT NOT NULL,
      usage_type TEXT NOT NULL,
      monthly_bill REAL NOT NULL,
      electricity_rate REAL NOT NULL,
      report_json TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}

const db = await openDatabase();

const app = express();
app.use(cors());
app.use(express.json());

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
const emailPort = Number(process.env.EMAIL_PORT || 587);
const emailSecure = process.env.EMAIL_SECURE === "true";
const emailFrom = process.env.EMAIL_FROM || emailUser;
const companyEmail = process.env.COMPANY_EMAIL || "raghav.enterpris1@gmail.com";
const canSendEmail = Boolean(emailUser && emailPass);

async function sendCompanyEmail({ subject, text, html, replyTo }) {
  if (!canSendEmail) return false;
  await transporter.sendMail({
    from: emailFrom,
    to: companyEmail,
    replyTo: replyTo || undefined,
    subject,
    text,
    html,
  });
  return true;
}

let transporter = null;
if (canSendEmail) {
  transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailSecure,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
} else {
  console.warn("WARNING: EMAIL_USER or EMAIL_PASS is missing in backend/.env. Contact form submissions will still be saved, but email delivery is disabled.");
}

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
    return res.status(400).json({
      message: "Please complete all required fields before submitting the form.",
    });
  }

  let requestId;

  try {
    const insertResult = await db.run(
      "INSERT INTO contact_requests (name, email, phone, message, status) VALUES (?, ?, ?, ?, ?)",
      name.trim(),
      email.trim(),
      phone.trim(),
      message.trim(),
      "pending"
    );

    requestId = insertResult.lastID;

    if (!canSendEmail) {
      await db.run("UPDATE contact_requests SET status = ? WHERE id = ?", "saved", requestId);
      return res.json({
        message:
          "Your request has been received successfully. Email delivery is not configured, but your message has been saved.",
      });
    }

    await sendCompanyEmail({
      replyTo: email.trim(),
      subject: `New contact request from ${name.trim()}`,
      text: `Name: ${name.trim()}
Email: ${email.trim()}
Phone: ${phone.trim()}

Message:
${message.trim()}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${name.trim()}</p>
        <p><strong>Email:</strong> ${email.trim()}</p>
        <p><strong>Phone:</strong> ${phone.trim()}</p>
        <p><strong>Message:</strong></p>
        <p>${message.trim().replace(/\n/g, "<br>")}</p>
      `,
    });
    await db.run("UPDATE contact_requests SET status = ? WHERE id = ?", "sent", requestId);

    return res.json({
      message: "Your request has been submitted successfully. We will contact you soon.",
    });
  } catch (error) {
    console.error("Contact submission error:", error?.message ?? error);

    if (requestId) {
      await db.run("UPDATE contact_requests SET status = ? WHERE id = ?", "failed", requestId);
    }

    return res.status(500).json({
      message:
        error?.message ||
        "Your request could not be submitted at this time. Please try again later.",
    });
  }
});

app.post("/api/calculator/consultation", async (req, res) => {
  const {
    name,
    email,
    phone,
    location,
    roofType,
    roofSize,
    usageType,
    monthlyBill,
    rate,
    calculations,
  } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    return res.status(400).json({
      message: "Please complete name, email, and phone before requesting a consultation.",
    });
  }

  if (!/^\d{10}$/.test(String(phone).trim())) {
    return res.status(400).json({ message: "Please enter a valid 10-digit phone number." });
  }

  if (!/^\S+@\S+\.\S+$/.test(String(email).trim())) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  const report = calculations ?? {};
  let requestId;

  try {
    const insertResult = await db.run(
      `INSERT INTO solar_consultations
        (name, email, phone, location, roof_type, roof_size, usage_type, monthly_bill, electricity_rate, report_json, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      name.trim(),
      email.trim(),
      phone.trim(),
      String(location || "Ahmedabad").trim(),
      String(roofType || "").trim(),
      String(roofSize || "").trim(),
      String(usageType || "").trim(),
      Number(monthlyBill) || 0,
      Number(rate) || 0,
      JSON.stringify(report),
      "pending"
    );

    requestId = insertResult.lastID;

    const formatRs = (n) =>
      `₹${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;

    const emailText = `New solar consultation request

Name: ${name.trim()}
Email: ${email.trim()}
Phone: ${phone.trim()}

City: ${location}
Roof: ${roofType} (${roofSize})
Usage: ${usageType}
Monthly bill: ${formatRs(monthlyBill)}
Rate: ₹${rate}/unit

Estimated system: ${report.systemSize ?? "—"} kW
25-year savings: ${formatRs(report.lifetimeSavings)}
Payback: ${report.payback ?? "—"} years
Panels: ${report.panelCount ?? "—"}
`;

    const emailHtml = `
      <h2>New Solar Consultation Request</h2>
      <p><strong>Name:</strong> ${name.trim()}</p>
      <p><strong>Email:</strong> ${email.trim()}</p>
      <p><strong>Phone:</strong> ${phone.trim()}</p>
      <hr />
      <p><strong>City:</strong> ${location}</p>
      <p><strong>Roof:</strong> ${roofType} (${roofSize})</p>
      <p><strong>Usage:</strong> ${usageType}</p>
      <p><strong>Monthly bill:</strong> ${formatRs(monthlyBill)}</p>
      <p><strong>Rate:</strong> ₹${rate}/unit</p>
      <hr />
      <p><strong>System size:</strong> ${report.systemSize ?? "—"} kW</p>
      <p><strong>25-year savings:</strong> ${formatRs(report.lifetimeSavings)}</p>
      <p><strong>Payback:</strong> ${report.payback ?? "—"} years</p>
      <p><strong>Panel count:</strong> ${report.panelCount ?? "—"}</p>
    `;

    const sent = await sendCompanyEmail({
      replyTo: email.trim(),
      subject: `Solar consultation: ${name.trim()} (${location})`,
      text: emailText,
      html: emailHtml,
    });

    await db.run(
      "UPDATE solar_consultations SET status = ? WHERE id = ?",
      sent ? "sent" : "saved",
      requestId
    );

    return res.json({
      message: sent
        ? "Thanks! Your free consultation request has been sent. We will contact you soon."
        : "Your request has been saved. Our team will contact you shortly.",
    });
  } catch (error) {
    console.error("Consultation submission error:", error?.message ?? error);

    if (requestId) {
      await db.run("UPDATE solar_consultations SET status = ? WHERE id = ?", "failed", requestId);
    }

    return res.status(500).json({
      message:
        error?.message ||
        "Unable to submit your consultation request. Please try again later.",
    });
  }
});

app.get("/api/submissions", async (req, res) => {
  try {
    const submissions = await db.all(
      "SELECT id, name, email, phone, message, status, created_at FROM contact_requests ORDER BY created_at DESC"
    );
    return res.json({ requests: submissions });
  } catch (error) {
    console.error("Submission retrieval error:", error?.message ?? error);
    return res.status(500).json({ message: "Unable to load submissions." });
  }
});

app.get("/api/health", (req, res) => {
  return res.json({ status: "ok" });
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Please stop the other server or change PORT in backend/.env.`);
    process.exit(1);
  }
  console.error("Server error:", err);
  process.exit(1);
});
