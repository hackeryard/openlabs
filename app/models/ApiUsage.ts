import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApiUsage extends Document {
  organizationId: mongoose.Types.ObjectId;
  apiKeyId?: mongoose.Types.ObjectId;
  endpoint: string;
  method: string;
  statusCode: number;
  labId?: string;
  responseTimeMs: number;
  timestamp: Date;
}

const ApiUsageSchema = new Schema<IApiUsage>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    apiKeyId: {
      type: Schema.Types.ObjectId,
      ref: "ApiKey",
      index: true,
    },
    endpoint: { type: String, required: true },
    method: { type: String, required: true },
    statusCode: { type: Number, required: true },
    labId: { type: String, default: null },
    responseTimeMs: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

// Compound index for fast time-window quota aggregation
ApiUsageSchema.index({ organizationId: 1, timestamp: -1 });

const ApiUsage: Model<IApiUsage> =
  mongoose.models.ApiUsage ||
  mongoose.model<IApiUsage>("ApiUsage", ApiUsageSchema);

export default ApiUsage;

