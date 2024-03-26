const mongoose = require("mongoose");

const candidateRoundSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Careers",
        required: true,
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        unique: true,
    },
    roundType: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "scheduled", "completed", "cancelled"],
        default: "pending",
    },
    date: {
        type: Date,
        required: true,
    },
    interviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    feedback: {
        type: String,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    score: {
        type: Number,
    },
});

const CandidateRound = mongoose.model("CandidateRounds", candidateRoundSchema);

module.exports = CandidateRound;
