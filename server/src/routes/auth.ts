import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  JWT_SECRET,
  DEFAULT_INDUSTRY_EMAIL,
  DEFAULT_INDUSTRY_PASSWORD
} from "../config/env";
import { User } from "../models/User";

const router = Router();

// Signup route that registers a new user with email and password
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existing = await User.findOne({ email: normalizedEmail }).exec();
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({ email: normalizedEmail, passwordHash });

    return res.status(201).json({ message: "User registered successfully" });
  } catch {
    return res.status(500).json({ message: "Failed to sign up" });
  }
});

// Login route that checks email and password
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const normalizedEmail = email.toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  // Allow default env user without signup
  if (normalizedEmail === DEFAULT_INDUSTRY_EMAIL.toLowerCase()) {
    if (password !== DEFAULT_INDUSTRY_PASSWORD) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ email: normalizedEmail }, JWT_SECRET, {
      expiresIn: "8h"
    });

    return res.json({ token, email: normalizedEmail });
  }

  const user = await User.findOne({ email: normalizedEmail }).exec();
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ email: normalizedEmail }, JWT_SECRET, {
    expiresIn: "8h"
  });

  return res.json({ token, email: normalizedEmail });
});

export default router;

