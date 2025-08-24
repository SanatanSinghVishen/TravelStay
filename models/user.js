const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");



const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});

// Add indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);