//helpers
import jwt from "jsonwebtoken";

//middlewares
import asyncHandler from "./asyncHandler.js";

//models
import User from "../models/User.js";

//protect routes for users that are registered

const protect = asyncHandler(async (req, res, next) => {
  let token;
  //read the jwt from the cookie (remember, we named it jwt)
  token = req.cookies.jwt;
  if (token) {
    try {
      //decode the token to get userid,
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //req.user - adds user to request object, with user props
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("not authorized, no token");
  }
});

export { protect };
