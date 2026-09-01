import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    default: "user",
    index: true,
  },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  username: { type: String, unique: true, sparse: true },
  avatar: { type: String, default: null },
  bio: { type: String, maxlength: 160, default: "" },
  profileSetupComplete: { type: Boolean, default: false },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  highestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: null },

  badges: [
    {
      id: String,
      name: String,
      earnedAt: Date,
      pinned: { type: Boolean, default: false },
    }
  ],
  completedExperiments: [
    {
      experimentId: String,
      subject: String,
      completedAt: Date,
      xpEarned: Number,
      timesVisited: { type: Number, default: 1 },
    }
  ],
  subjectProgress: [
    {
      subject: String,
      xp: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      experimentsCompleted: { type: Number, default: 0 },
    }
  ],
  activityLog: [
    {
      date: String,
      count: Number,
    }
  ],
  dailyChallenges: [
    {
      labId: {
        type: String,
        required: true,
      },

      date: {
        type: Date,
        required: true,
      },

      completed: {
        type: Boolean,
        default: false,
      },

      attempts: {
        type: Number,
        default: 0,
        min: 0,
      },

      xpEarned: {
        type: Number,
        default: 0,
        min: 0,
      },
    }
  ],
  aiQueriesCount: {
    type: Number,
    default: 0,
  },
  lastAiQueryDate: {
    type: String,
    default: null,
  },
  location: {
    ip: { type: String, default: "" },
    city: { type: String, default: "" },
    region: { type: String, default: "" },
    country: { type: String, default: "" },
    countryCode: { type: String, default: "" },
    timezone: { type: String, default: "" },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    lastUpdated: { type: Date, default: Date.now },
  },
  loginHistory: [
    {
      ip: String,
      city: String,
      region: String,
      country: String,
      countryCode: String,
      userAgent: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
})

export default mongoose.models.User || mongoose.model("User", UserSchema)

