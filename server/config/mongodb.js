// connecting mongoDB

import mongoose from "mongoose"

const connectDB = async () => {

    mongoose.connection.on('connected', ()=> console.log("database connected"))

    await mongoose.connect(`${process.env.MONGODB_URI}/email_authentication`)
}

export default connectDB 



// import mongoose from "mongoose";

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         console.log("✅ Database connected successfully!");

//         mongoose.connection.on("connected", () => {
//             console.log("🔗 Mongoose is now connected!");
//         });

//         mongoose.connection.on("error", (err) => {
//             console.error("❌ Mongoose connection error:", err);
//         });

//     } catch (error) {
//         console.error("❌ MongoDB connection failed:", error);
//         process.exit(1);
//     }
// };

// export default connectDB;








