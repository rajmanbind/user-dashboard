import mongoose from "mongoose"
const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    sentAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["sent", "delivered", "seen"],
        default: "sent",
    },
});

export default mongoose.model("Message", MessageSchema);
