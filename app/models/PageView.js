import mongoose from "mongoose"

const PageViewSchema = new mongoose.Schema(
    {
        pathname: {
            type: String,
            required: true,
            index: true,
        },

        title: {
            type: String,
            default: "",
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

        referrer: {
            type: String,
            default: "",
        },

        referrerDomain: {
            type: String,
            default: "Direct",
            index: true,
        },

        utmSource: {
            type: String,
            default: null,
            index: true,
        },

        utmMedium: {
            type: String,
            default: null,
        },

        utmCampaign: {
            type: String,
            default: null,
        },

        device: {
            type: String,
            enum: ["desktop", "mobile", "tablet", "unknown"],
            default: "desktop",
            index: true,
        },

        browser: {
            type: String,
            default: "Unknown",
            index: true,
        },

        os: {
            type: String,
            default: "Unknown",
            index: true,
        },

        screen: {
            type: String,
            default: "",
        },

        language: {
            type: String,
            default: "en",
        },

        timezone: {
            type: String,
            default: "",
        },

        country: {
            type: String,
            default: "Unknown",
            index: true,
        },

        city: {
            type: String,
            default: "",
        },

        // Dwell time on this pageview in seconds
        duration: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Maximum vertical scroll depth (0 - 100%)
        scrollDepth: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
    }
)

// Compound indexes for time-series aggregation and lookup performance
PageViewSchema.index({ createdAt: -1 })
PageViewSchema.index({ pathname: 1, createdAt: -1 })
PageViewSchema.index({ sessionId: 1, createdAt: -1 })
PageViewSchema.index({ visitorId: 1, createdAt: -1 })
PageViewSchema.index({ labId: 1, createdAt: -1 })

export default mongoose.models.PageView || mongoose.model("PageView", PageViewSchema)
