import mongoose from "mongoose"

const AnalyticsEventSchema = new mongoose.Schema(
    {
        eventName: {
            type: String,
            required: true,
            index: true,
        },

        category: {
            type: String,
            default: "general",
            index: true,
        },

        labId: {
            type: String,
            default: null,
            index: true,
        },

        visitorId: {
            type: String,
            required: true,
            index: true,
        },

        sessionId: {
            type: String,
            required: true,
            index: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true,
        },

        pathname: {
            type: String,
            default: "",
        },

        properties: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        value: {
            type: Number,
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

AnalyticsEventSchema.index({ createdAt: -1 })
AnalyticsEventSchema.index({ eventName: 1, createdAt: -1 })
AnalyticsEventSchema.index({ labId: 1, createdAt: -1 })

export default mongoose.models.AnalyticsEvent || mongoose.model("AnalyticsEvent", AnalyticsEventSchema)
