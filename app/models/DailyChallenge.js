import mongoose from "mongoose"

const DailyChallengeSchema = new mongoose.Schema(
    {
        labId: {
            type: String,
            required: true,
            index: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        date: {
            type: Date,
            required: true,
            index: true,
        },

        challenge: {
            type: String,
            required: true,
            trim: true,
        },

        hint: {
            type: String,
            default: "",
            trim: true,
        },

        targetParam: {
            type: String,
            required: true,
        },

        targetValue: {
            type: Number,
            required: true,
        },

        tolerance: {
            type: Number,
            default: 0,
            min: 0,
        },

        xpReward: {
            type: Number,
            default: 50,
            min: 0,
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "easy",
        },
    },
    {
        timestamps: true,
    }
)

// Prevent duplicate challenge per lab per date
DailyChallengeSchema.index(
    { labId: 1, date: 1 },
    { unique: true }
)

export default mongoose.models.DailyChallenge || mongoose.model(
    "DailyChallenge",
    DailyChallengeSchema
)