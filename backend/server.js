//server
import express from "express";

import path from "path"
import { fileURLToPath } from 'url';

//libraries
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

//database
import connectDB from "./config/db.js";

//rest of packages
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimiter from 'express-rate-limit';


//routes
import cyclistRoutes from "./routes/cyclistRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import fantasyTeamRoutes from "./routes/fantasyRoutes.js";

//port variable
const port = process.env.PORT || 5000;

//using es modules, but dirname is  acommon js feature. have to use import meta to get the dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

//init db and server
connectDB();
const app = express();

//security
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(mongoSanitize());

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use("/api/cyclists", cyclistRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);
app.use("/api/fantasyteam", fantasyTeamRoutes);


//for production (might have to change the paths to   app.use(express.static(path.join(__dirname, "/frontend/build")));
 // app.get("*", (req, res) =>
 // res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html")))

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is up and running...");
  });
}

try {
  app.listen(port, () => console.log(`server running on port ${port}`));
} catch (error) {
  console.log(error);
}
