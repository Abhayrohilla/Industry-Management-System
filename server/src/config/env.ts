import dotenv from "dotenv";

dotenv.config();

export const APP_PORT = process.env.APP_PORT || "5000";
export const MONGODB_URI = process.env.MONGODB_URI || "";
export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
export const DEFAULT_INDUSTRY_EMAIL = process.env.DEFAULT_INDUSTRY_EMAIL || "industry@example.com";
export const DEFAULT_INDUSTRY_PASSWORD = process.env.DEFAULT_INDUSTRY_PASSWORD || "Industry@007";
