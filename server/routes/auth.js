const express = require("express");
const ctrl = require("../controllers/authController");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

// ✅ Register route — temporary debug version
router.post("/register", async (req, res) => {
  console.log("Register request body:", req.body); // Log the incoming data

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Call your controller to handle actual registration
    await ctrl.register(req, res);
  } catch (err) {
    console.error("Register route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Other routes stay the same
router.post("/login", ctrl.login);
router.post("/logout", ctrl.logout);
router.get("/me", requireAuth, ctrl.me);
router.post("/forgot", ctrl.forgotPassword);
router.post("/reset", ctrl.resetPassword);

module.exports = router;