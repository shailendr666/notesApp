
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health",(req,res)=>{
    res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async()=>{
    try {
        await connectDB();
        app.listen(PORT,()=>{
        console.log(`server is running on the port ${PORT}`)
})
    } catch (error) {
        console.error("error in server: ", error.message);
    }
}

startServer();

export default app;