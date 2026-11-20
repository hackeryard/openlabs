import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrganizationPlan {
  name: "pilot" | "institutional" | "enterprise";
  maxMonthlyRequests: number;
  requestsPerMinute: number;
  maxStudents: number;
}

export type LicenseType =
  | "pilot"
  | "single-institution"
  | "multi-institution"
  | "white-label"
  | "custom-enterprise";

export interface IOrganizationBilling {
  paymentStatus: "paid" | "pending" | "overdue" | "waived" | "trial";
  invoiceReference?: string;
  billingContact?: string;
  notes?: string;
  renewalDate?: Date;
}

export interface IOrganization extends Document {
  name: string;
  slug: string;
  type: "school" | "university" | "company" | "partner";
  status: "pending" | "active" | "suspended";
  contactEmail: string;
  plan: IOrganizationPlan;
  licenseType: LicenseType;
  billing: IOrganizationBilling;
  allowedOrigins: string[];
  licensedLabs: string[];
  licensedSubjects: string[];
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["school", "university", "company", "partner"],
      default: "school",
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "active",
      index: true,
    },
    contactEmail: { type: String, required: true, lowercase: true, trim: true },
    plan: {
      name: {
        type: String,
        enum: ["pilot", "institutional", "enterprise"],
        default: "pilot",
      },
      maxMonthlyRequests: { type: Number, default: 10000 },
      requestsPerMinute: { type: Number, default: 60 },
      maxStudents: { type: Number, default: 100 },
    },
    licenseType: {
      type: String,
      enum: [
        "pilot",
        "single-institution",
        "multi-institution",
        "white-label",
        "custom-enterprise",
      ],
      default: "pilot",
      index: true,
    },
    billing: {
      paymentStatus: {
        type: String,
        enum: ["paid", "pending", "overdue", "waived", "trial"],
        default: "trial",
      },
      invoiceReference: { type: String, default: "" },
      billingContact: { type: String, default: "" },
      notes: { type: String, default: "" },
      renewalDate: { type: Date },
    },
    allowedOrigins: [{ type: String, trim: true }],
    licensedLabs: [{ type: String, default: ["*"] }],
    licensedSubjects: [
      {
        type: String,
        enum: ["physics", "chemistry", "biology", "computer-science", "mathematics"],
      },
    ],
    validUntil: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year default
    },
  },
  { timestamps: true }
);

const Organization: Model<IOrganization> =
  mongoose.models.Organization ||
  mongoose.model<IOrganization>("Organization", OrganizationSchema);

export default Organization;
