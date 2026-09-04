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

        region: {
            type: String,
            default: "",
        },

        city: {
            type: String,
            default: "",
        },

        ip: {
            type: String,
            default: "",
        },

        // Total wall-clock dwell time on this pageview in seconds
        duration: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Active duration (seconds user was actively moving, clicking, typing or scrolling)
        activeDuration: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Idle duration (seconds tab was backgrounded or inactive)
        idleDuration: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Times tab gained focus vs blurred
        focusCount: {
            type: Number,
            default: 1,
            min: 1,
        },

        // Maximum vertical scroll depth (0 - 100%)
        scrollDepth: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        // Milestone scroll depths reached: [25, 50, 75, 90, 100]
        scrollMilestones: {
            type: [Number],
            default: [],
        },

        // Core Web Vitals & Real User Monitoring (RUM) performance metrics
        webVitals: {
            fcp: { type: Number, default: null }, // First Contentful Paint (ms)
            lcp: { type: Number, default: null }, // Largest Contentful Paint (ms)
            cls: { type: Number, default: null }, // Cumulative Layout Shift score
            inp: { type: Number, default: null }, // Interaction to Next Paint / FID (ms)
            ttfb: { type: Number, default: null }, // Time to First Byte (ms)
            domLoad: { type: Number, default: null }, // DOMContentLoaded (ms)
            windowLoad: { type: Number, default: null }, // Window Load (ms)
        },

        // Hardware capabilities & GPU profile
        hardware: {
            memory: { type: Number, default: null }, // RAM in GB (e.g. 8)
            cores: { type: Number, default: null }, // Logical CPU cores
            gpu: { type: String, default: "" }, // Unmasked WebGL renderer
            dpr: { type: Number, default: 1 }, // Device Pixel Ratio
            viewport: { type: String, default: "" }, // e.g. "1920x1080"
            touchPoints: { type: Number, default: 0 }, // Max touch points
        },

        // Network connection profile
        network: {
            effectiveType: { type: String, default: "" }, // '4g', '3g', '2g', 'slow-2g'
            downlink: { type: Number, default: null }, // Bandwidth in Mbps
            rtt: { type: Number, default: null }, // Round-trip time in ms
            saveData: { type: Boolean, default: false },
        },

        // Bounce & Exit Signals
        isBounce: {
            type: Boolean,
            default: false,
            index: true,
        },

        exitIntent: {
            type: Boolean,
            default: false,
        },

        // Whether visitor has visited in prior sessions (returning visitor)
        isReturning: {
            type: Boolean,
            default: false,
            index: true,
        },

        // Ordinal visit session count for this visitor (1 = first visit, 2+ = returning)
        visitCount: {
            type: Number,
            default: 1,
            min: 1,
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
PageViewSchema.index({ isReturning: 1, createdAt: -1 })
PageViewSchema.index({ visitorId: 1, isReturning: 1 })
PageViewSchema.index({ labId: 1, createdAt: -1 })
PageViewSchema.index({ isBounce: 1, createdAt: -1 })
PageViewSchema.index({ "webVitals.lcp": 1, createdAt: -1 })

export default mongoose.models.PageView || mongoose.model("PageView", PageViewSchema)
