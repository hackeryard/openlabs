import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApiKey extends Document {
  name: string;
  keyPrefix: string;
  hashedKey: string;
  organizationId: mongoose.Types.ObjectId;
  scopes: string[];
  permittedLabs: string[];
  status: "active" | "revoked" | "expired";
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  requestCount: number;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ApiKeySchema = new Schema<IApiKey>(
  {
    name: { type: String, required: true, trim: true },
    keyPrefix: { type: String, required: true, trim: true },
    hashedKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    scopes: {
      type: [String],
      default: ["labs:read", "embed:create", "usage:read"],
    },
    permittedLabs: {
      type: [String],
      default: ["*"],
    },
    status: {
      type: String,
      enum: ["active", "revoked", "expired"],
      default: "active",
      index: true,
    },
    expiresAt: { type: Date, default: null },
    lastUsedAt: { type: Date, default: null },
    requestCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const ApiKey: Model<IApiKey> =
  mongoose.models.ApiKey ||
  mongoose.model<IApiKey>("ApiKey", ApiKeySchema);

export default ApiKey;

