const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
    
}, { timestamps: true}
);

userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1,email:1,password:1 }, { unique: true });
userSchema.index({ username: 1,password:1 }, { unique: true });

const User = mongoose.model('Users', userSchema);

module.exports = User;
