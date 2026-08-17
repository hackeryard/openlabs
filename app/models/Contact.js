import mongoose from "mongoose"

const ContactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 3000,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        status: {
            type: String,
            enum: ["new", "read", "replied", "archived"],
            default: "new",
            index: true,
        },

        emailSent: {
            type: Boolean,
            default: false,
        },

        emailError: {
            type: String,
            default: null,
        },

        userAgent: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

// Index for fast sorting by newest
ContactSchema.index({ createdAt: -1 })
ContactSchema.index({ status: 1, createdAt: -1 })

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema)
