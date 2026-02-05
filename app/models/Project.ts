import mongoose, { Schema, Model, Document } from "mongoose";

export interface IProject extends Document {
  projectId: string;
  projectType: string;
  userId: string;
  title: string;
  html: string;
  css: string;
  js: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    projectId: { type: String, required: true },
    projectType: { type: String, required: true },
    userId: { type: String, required: true },

    title: { type: String, default: "Untitled Project" },
    html: String,
    css: String,
    js: String,
  },
  { timestamps: true }
);

/* 🔐 Composite Unique Key */
ProjectSchema.index(
  { projectId: 1, userId: 1 },
  { unique: true }
);

/* Prevent Next.js model cache issue */
delete (mongoose.models as any).Project;

const Project: Model<IProject> =
  mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
