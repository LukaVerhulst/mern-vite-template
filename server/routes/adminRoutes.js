import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, admin, (req, res) => {
  res.json({ message: `Welcome admin ${req.user.name}`, now: new Date() });
});

export default router;