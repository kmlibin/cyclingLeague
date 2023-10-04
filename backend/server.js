//server
import express from "express";

//libraries
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

//database
import connectDB from "./config/db.js";

//routes
import cyclistRoutes from "./routes/cyclistRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import fantasyTeamRoutes from "./routes/fantasyTeamRoutes.js";

//port variable
const port = process.env.PORT || 5000;

//init db and server
connectDB();
const app = express();


//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is up and running...");
});

//routes
app.use("/api/cyclists", cyclistRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);
app.use("/api/fantasyteam", fantasyTeamRoutes);

try {
  // await createTeamData()
  app.listen(port, () => console.log(`server running on port ${port}`));
} catch (error) {}
