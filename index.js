import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import postRoute from "./routes/postRoute.js"
import cors from "cors";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();



// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", ""],
  })
);

app.use(express.json());



app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));




// Routes
app.use("/api/post", postRoute);

const PORT = process.env.PORT || 5055;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
