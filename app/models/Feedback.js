import mongoose from "mongoose"

const FeedbackSchema = new mongoose.Schema(
    {
        labId: {
            type: String,
            required: true,
            index: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        sessionId: {
            type: String,
            required: true,
        },

        // Quick pulse: thumbs up / thumbs down
        helpful: {
            type: Boolean,
            default: null,
        },

        // Deep feedback: 1–5 star rating
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: null,
        },

        category: {
            type: String,
            enum: ["bug", "confusing", "wrong-content", "suggestion", "praise", "helpful", "general", null],
            default: null,
        },

        comment: {
            type: String,
            maxlength: 500,
            default: "",
        },

        // Which step/tab the user was on when they left feedback
        labStep: {
            type: String,
            default: null,
        },

        status: {
            type: String,
            enum: ["new", "reviewed", "fixed"],
            default: "new",
        },

        userAgent: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

// Fast lookups: feedback for a lab sorted by newest
FeedbackSchema.index({ labId: 1, createdAt: -1 })

// Rate-limit lookups: prevent duplicate submissions per session per lab per day
FeedbackSchema.index({ sessionId: 1, labId: 1, createdAt: -1 })

export default mongoose.models.Feedback || mongoose.model(
    "Feedback",
    FeedbackSchema
)
