import mongoose, { Document, Model } from 'mongoose';

export interface IBlog extends Document {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: Date;
  readTime?: string;
  published: boolean;
  coverImage?: string;
  faqs?: {
    question: string;
    answer: string;
  }[];
  metaTitle?: string;
  metaDescription?: string;
}

const blogSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: "OpenLabs Team",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  readTime: {
    type: String,
  },
  published: {
    type: Boolean,
    default: false,
    index: true,
  },
  coverImage: {
    type: String,
  },
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],
  metaTitle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
}, {
  timestamps: true,
});

const Blog: Model<IBlog> = mongoose.models.Blog as Model<IBlog> || mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;
