import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config()
console.log("MONGO_URI:", process.env.MONGO_URI ? "FOUND" : "NOT FOUND");

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
}   )