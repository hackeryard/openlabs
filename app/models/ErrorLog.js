import mongoose from "mongoose"

const ErrorLogSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        stack: {
            type: String,
            default: "",
        },

        digest: {
            type: String,
            default: null,
            index: true,
        },

        componentStack: {
            type: String,
            default: null,
        },

        errorType: {
            type: String,
            enum: ["runtime", "unhandledrejection", "boundary", "network", "api"],
            default: "runtime",
            index: true,
        },

        pathname: {
            type: String,
            required: true,
            index: true,
        },

        visitorId: {
            type: String,
            default: null,
            index: true,
        },

        sessionId: {
            type: String,
            default: null,
            index: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true,
        },

        device: {
            type: String,
            default: "desktop",
        },

        browser: {
            type: String,
            default: "Unknown",
        },

        os: {
            type: String,
            default: "Unknown",
        },

        userAgent: {
            type: String,
            default: null,
        },

        status: {
            type: String,
            enum: ["new", "investigating", "resolved", "ignored"],
            default: "new",
            index: true,
        },

        // Deduplication counter
        occurrences: {
            type: Number,
            default: 1,
            min: 1,
        },

        lastOccurredAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: true,
    }
)

ErrorLogSchema.index({ lastOccurredAt: -1 })
ErrorLogSchema.index({ status: 1, lastOccurredAt: -1 })
ErrorLogSchema.index({ message: 1, pathname: 1 })

export default mongoose.models.ErrorLog || mongoose.model("ErrorLog", ErrorLogSchema)
