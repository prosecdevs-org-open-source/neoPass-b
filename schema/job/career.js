const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    company: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    jobType: {
        type: String,
        enum: ["Full Time", "Internship"],
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    whatYouWouldDo: [{
        type: String,
        required: true,
    }],
    whatWeNeed: [{
        type: String,
        required: true,
    }],
    eligibilityCriteria: {
        type: String,
        required: true,
    },
    minimumQualifications: [{
        type: String,
        required: true
    }],
    preferredQualifications: [{
        type: String,
    }],
    responsibilities: [{
        type: String,
        required: true,
    }],
    datePosted: {
        type: Date,
        default: Date.now,
        required: true,
    },
    applicationDeadline: {
        type: Date,
        required: true,
    },
    companyLogoUrl: {
        type: String,
    },
    jobAdvertisementImageUrl: {
        type: String,
    },
});

const Career = mongoose.model("Careers", jobSchema);

module.exports = Career;
