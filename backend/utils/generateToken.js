import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  //create token...object that takes in the payload, secret, expires in
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  //set JWT as http-only cookie, on server
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    //30 days in ms
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};


export default generateToken