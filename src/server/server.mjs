// src/server/server.mjs
import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// --- Load .env from both project root and src/server ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.resolve(__dirname, "../../.env");
const localEnvPath = path.resolve(__dirname, ".env");

// Load root .env (project root)
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}
// Also load a local .env (src/server) if present — overrides root values
if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
}

// Tiny helper to print where we looked
console.log("🗂  .env (root) exists:", fs.existsSync(rootEnvPath), "->", rootEnvPath);
console.log("🗂  .env (local) exists:", fs.existsSync(localEnvPath), "->", localEnvPath);

// --- Validate keys ---
const PORT = process.env.PORT || 3001;
const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  console.error("❌ Missing STRIPE_SECRET_KEY. Add it to either:");
  console.error("   -", rootEnvPath);
  console.error("   -", localEnvPath);
  process.exit(1);
}
if (secretKey.startsWith("pk_")) {
  console.error("❌ STRIPE_SECRET_KEY looks like a publishable key (pk_...). It must start with sk_");
  process.exit(1);
}

// --- App & Stripe ---
const app = express();
const stripe = new Stripe(secretKey);

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3002"],
  credentials: true
}));
app.use(express.json());

// Health checks
app.get("/", (_req, res) => res.json({ ok: true, message: "Payments API running 🚀" }));
app.get("/ping", (_req, res) => res.json({ ok: true }));

// Minimal Checkout Session (subscription by default)
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    console.log("➡️  POST /api/create-checkout-session body:", req.body);
    const { priceId, userId } = req.body || {};

    if (!priceId) {
      return res.status(400).json({ error: "priceId required" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription", // change to 'payment' if one-time
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/cancel",
      client_reference_id: userId || null, // optional
    });

    console.log("✅ Created session:", session.id);
    res.json({ sessionId: session.id });
  } catch (err) {
    console.error("❌ Stripe error:", err?.message || err);
    res.status(400).json({ error: err?.message || "Stripe error" });
  }
});

// (Optional) confirm success endpoint
app.post("/api/confirm-success", async (req, res) => {
  try {
    const { sessionId } = req.body || {};
    if (!sessionId) return res.status(400).json({ error: "sessionId required" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("🔍 session:", session.id, "status:", session.payment_status);

    if (session.payment_status !== "paid" && session.status !== "complete") {
      return res.status(400).json({ error: "Session not paid/complete" });
    }
    res.json({ ok: true, message: "Payment confirmed!" });
  } catch (err) {
    console.error("❌ confirm-success error:", err?.message || err);
    res.status(400).json({ error: err?.message || "Error confirming session" });
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: `Not Found: ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log(`✅ Payments server on http://localhost:${PORT}`);
});
