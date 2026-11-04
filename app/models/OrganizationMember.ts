import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrganizationMember extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: "owner" | "admin" | "developer" | "member";
  status: "active" | "invited" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationMemberSchema = new Schema<IOrganizationMember>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "developer", "member"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["active", "invited", "suspended"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate user membership in the same organization
OrganizationMemberSchema.index(
  { organizationId: 1, userId: 1 },
  { unique: true }
);

const OrganizationMember: Model<IOrganizationMember> =
  mongoose.models.OrganizationMember ||
  mongoose.model<IOrganizationMember>("OrganizationMember", OrganizationMemberSchema);

export default OrganizationMember;

