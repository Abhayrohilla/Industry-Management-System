import { Schema, model, Document } from "mongoose";

// Industry document type
export interface IndustryDocument extends Document {
  name: string;
  type: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  website?: string;
  description?: string;
  createdAt: Date;
}

const IndustrySchema = new Schema<IndustryDocument>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    country: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
    description: { type: String, trim: true }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const Industry = model<IndustryDocument>("Industry", IndustrySchema);

