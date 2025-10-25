import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import "dotenv/config";
import chatRoutes from "./routes/chat.js";
const app = express();
const PORT = 8000;


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use("/api", chatRoutes);

// Sample route
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
  } 
};
