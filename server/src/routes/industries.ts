import { Router, Request, Response } from "express";
import { Industry } from "../models/Industry";
import { requireAuth } from "../middleware/auth";

const router = Router();

function normalizeIndustry(doc: any) {
  const raw = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    _id: raw._id,
    name: raw.name ?? raw["Industry Name"] ?? "",
    type: raw.type ?? raw["Industry Type"] ?? "",
    contactPerson: raw.contactPerson ?? raw["Contact Person"] ?? "",
    email: raw.email ?? raw.Email ?? "",
    phone: raw.phone ?? raw["Phone Number"] ?? "",
    address: raw.address ?? raw.Address ?? "",
    city: raw.city ?? raw.City ?? "",
    state: raw.state ?? raw.State ?? "",
    country: raw.country ?? raw.Country ?? "",
    website: raw.website ?? raw.Website ?? "",
    description: raw.description ?? raw["Industry Description"] ?? "",
    createdAt: raw.createdAt ?? raw["Created Date"] ?? null
  };
}

// Create new industry
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const {
      name,
      type,
      contactPerson,
      email,
      phone,
      address,
      city,
      country,
      website,
      description
    } = req.body;

    if (!name || !type || !contactPerson || !email || !phone || !address || !city || !country) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const industry = await Industry.create({
      name,
      type,
      contactPerson,
      email,
      phone,
      address,
      city,
      country,
      website,
      description
    });

    return res.status(201).json(industry);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create industry" });
  }
});

// Get industries with pagination, sorting, and filters
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      sort = "createdAt",
      order = "desc",
      name,
      type,
      city,
      email,
      contactPerson
    } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;

    const conditions: Record<string, unknown>[] = [];

    if (name) {
      const regex = { $regex: name, $options: "i" };
      conditions.push({ $or: [{ name: regex }, { "Industry Name": regex }] });
    }

    if (type) {
      const regex = { $regex: type, $options: "i" };
      conditions.push({ $or: [{ type: regex }, { "Industry Type": regex }] });
    }

    if (city) {
      const regex = { $regex: city, $options: "i" };
      conditions.push({ $or: [{ city: regex }, { City: regex }] });
    }

    if (email) {
      const regex = { $regex: email, $options: "i" };
      conditions.push({ $or: [{ email: regex }, { Email: regex }] });
    }

    if (contactPerson) {
      const regex = { $regex: contactPerson, $options: "i" };
      conditions.push({ $or: [{ contactPerson: regex }, { "Contact Person": regex }] });
    }

    const filters = conditions.length > 0 ? { $and: conditions } : {};

    const sortDirection = order === "asc" ? 1 : -1;
    const sortOptions: Record<string, number> = { [sort as string]: sortDirection };

    const total = await Industry.countDocuments(filters);
    const industries = await Industry.find(filters)
      .sort(sortOptions as any)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const data = industries.map((doc) => normalizeIndustry(doc));

    return res.json({
      data,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch {
    return res.status(500).json({ message: "Failed to load industries" });
  }
});

// Get single industry
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const industry = await Industry.findById(req.params.id).exec();
    if (!industry) {
      return res.status(404).json({ message: "Industry not found" });
    }
    return res.json(normalizeIndustry(industry));
  } catch {
    return res.status(500).json({ message: "Failed to load industry" });
  }
});

// Update industry
router.put("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const updated = await Industry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).exec();

    if (!updated) {
      return res.status(404).json({ message: "Industry not found" });
    }

    return res.json(updated);
  } catch {
    return res.status(500).json({ message: "Failed to update industry" });
  }
});

// Delete industry
router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const deleted = await Industry.findByIdAndDelete(req.params.id).exec();
    if (!deleted) {
      return res.status(404).json({ message: "Industry not found" });
    }
    return res.json({ message: "Industry deleted" });
  } catch {
    return res.status(500).json({ message: "Failed to delete industry" });
  }
});

export default router;

