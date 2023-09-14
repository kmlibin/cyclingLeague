import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    myTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FantasyTeam",
    },

    myLeague: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserTeam",
      },
    ],
  },
  { timestamps: true }
);

//hash password before the info is saved
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//match passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const User = mongoose.model("User", userSchema);
export default User;
