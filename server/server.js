const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

// ─── DEBUG INFO───────────────────────────────────────
try {
  const mdir = path.join(__dirname, "models");
  const rdir = path.join(__dirname, "routes");
  console.log("[BOOT] cwd =", process.cwd());
  console.log("[BOOT] __dirname =", __dirname);
  console.log("[BOOT] server/models exists?", fs.existsSync(mdir));
  if (fs.existsSync(mdir))
    console.log("[BOOT] server/models list:", fs.readdirSync(mdir));
  console.log("[BOOT] server/routes exists?", fs.existsSync(rdir));
  if (fs.existsSync(rdir))
    console.log("[BOOT] server/routes list:", fs.readdirSync(rdir));
} catch (e) {
  console.log("[BOOT] dir check error:", e);
}

// ─── MIDDLEWARE ─────────────────────────────────────────────
app.set("trust proxy", 1); // Required for Render + cookies
app.use(express.json());
app.use(cookieParser());

// ─── CORS: LOCAL + DEPLOYMENT SUPPORT ──────────────────────
const allowedOrigins = [
  "http://localhost:3000",           // Local frontend
  "https://pipetrack.onrender.com",  // Render frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ─── ROUTES ─────────────────────────────────────────────────
const authRoutes = require("./routes/auth");
const partsRoutes = require("./routes/parts");
const barcodesRoutes = require("./routes/barcodes");
const jobsRoutes = require("./routes/jobs");

app.use("/api/auth", authRoutes);
app.use("/api/parts", partsRoutes);
app.use("/api/barcodes", barcodesRoutes);
app.use("/api/jobs", jobsRoutes);

// ─── TEST / ROOT ROUTE ──────────────────────────────────────
app.get("/", (req, res) => {
  res.send("🚀 PipeTrack backend is running!");
});

// ─── DATABASE CONNECT ───────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err.message)
  );

// ─── START SERVER ───────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});