const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        unique: true,
    },
    legalName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    address: {
        country: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
    },
    primaryEmail: { type: String, required: true },
    secondaryEmail: { type: String },
    phoneNumber: { type: String },
    websitePortfolioLink: { type: String },
    education: [
        {
            school: { type: String },
            degree: { type: String },
            degreeStatus: {
                type: String,
                enum: ["Graduated", "Incomplete", "Now Attending"],
            },
            majorAreaOfStudy: { type: String },
            country: { type: String },
        },
    ],
    workExperience: [
        {
            employerName: { type: String },
            jobTitle: { type: String },
            startDate: { type: Date },
            startYear: { type: Number },
            endDate: { type: Date },
            endYear: { type: Number },
            country: { type: String },
            city: { type: String },
            state: { type: String },
        },
    ],
    skills: {
        codingLanguages: [{ type: String }],
        general: [{ type: String }],
        technical: [{ type: String }],
    },
    resume: { type: String },
    preferredLocations: [{ type: String }],
    languagesSpoken: [{ type: String }],
    certifications: [{ type: String }],
});

const Profile = mongoose.model("Profiles", profileSchema);

module.exports = Profile;
