import { Schema, model, Document } from "mongoose";

// User document type
export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const User = model<UserDocument>("User", UserSchema);

