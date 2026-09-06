import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config()
console.log("MONGO_URI:", process.env.MONGO_URI ? "FOUND" : "NOT FOUND");

connectDB();