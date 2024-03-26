const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jobs",
        required: true,
    },
    applicationDate: {
        type: Date,
        default: Date.now,
    },
    coverLetter: { type: String },
});

const Application = mongoose.model("Applications", applicationSchema);

module.exports = Application;
