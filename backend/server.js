import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";



const port = process.env.PORT || 5000;

connectDB();
const app = express();

app.get("/", (req, res) => {
  res.send("API is up and running...");
});

app.get("/api/riders", (req, res) => {
  res.send("riders");
});

app.get("/api/races", (req, res) => {
  res.send("races");
});

app.listen(port, () => console.log(`server running on port ${port}`));
