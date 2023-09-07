//server
import express from "express";

//libraries
import dotenv from "dotenv";
dotenv.config();

//database
import connectDB from "./config/db.js";

//routes
import cyclistRoutes from "./routes/cyclistRoutes.js";

//port variable
const port = process.env.PORT || 5000;

//init db and server
connectDB();
const app = express();


//body parser middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is up and running...");
});

//routes
app.use("/api/cyclists", cyclistRoutes);

app.listen(port, () => console.log(`server running on port ${port}`));
