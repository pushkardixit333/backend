import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index:true
    },
    avatar:{
        type: String,
        required:true
    },
    coverImage:{
        type: String,
        required:true
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
    password: {
        type: String,
        required: [true , "Password is required"],
    },
    refreshToken:{
        type: String}
}, {
    timestamps: true
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password=await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = function () {
    return jwt .sign(
  {
        userId: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    } , process.env.Access_TOKEN_SECRET, {
        expiresIn: process.env.Access_TOKEN_EXPIRE
    });

};
userSchema.methods.generateRefreshToken = function () {
    return jwt .sign(
  {
        userId: this._id
    } , process.env.Refresh_TOKEN_SECRET, {
        expiresIn: process.env.Refresh_TOKEN_EXPIRE
    });

};
export const User = mongoose.model("User", userSchema);