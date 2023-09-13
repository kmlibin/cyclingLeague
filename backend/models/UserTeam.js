import mongoose from "mongoose";

const userTeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cyclists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cyclist",
    },
  ],
});

const UserTeam = mongoose.model("UserTeam", userTeamSchema);
export default UserTeam;


