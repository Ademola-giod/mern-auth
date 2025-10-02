import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";


import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRouters.js";


const app = express();
const port = process.env.PORT || 4000;
console.log("🔍 MONGODB_URI:", process.env.MONGODB_URI);
// connect mongoDB
connectDB()

// cors
const allowedOrigins = [
    'http://localhost:5173',
    'https://mern-auth-backend-xi.vercel.app'
]


app.use(express.json());
app.use(cookieParser());

app.use(cors({origin: allowedOrigins , credentials: true}))

// API endpoints
app.get('/', (req, res) => res.send("Api is working "))
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter)
// endpoint for user router,


// app.listen(port, () => console.log(`server started on PORT:${port}`));

// Export for Vercel serverless function

export default app ;
