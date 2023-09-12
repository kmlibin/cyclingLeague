import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

//@desc register user
//@route POST /api/users
//@access Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  //check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("user already exists");
  }

  //first registered user is admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const isAdmin = isFirstAccount ? true : false;
  //create user
  const user = await User.create({
    name,
    email,
    password,
    isAdmin,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("invalid user data");
  }
};

//@desc auth user and get token
//@route POST /api/users/login
//@access Public

const authUser = async (req, res) => {
  const { email, password } = req.body;

  //create user
  const user = await User.findOne({ email });
  //compare passwords
  if (user && (await user.comparePassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401).json({ msg: "invalid credentials" });
  }
};

//@desc logout user and clear the cookie
//@route GET /api/users/logout
//@access Private
const logoutUser = async (req, res) => {
  //set to nothing to clear it
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ msg: "logged out successfully" });
};

export { registerUser, authUser, logoutUser };