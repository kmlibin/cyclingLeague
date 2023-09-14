import mongoose from "mongoose";

const fantasyTeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cyclists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cyclist",
    },
  ],
});

const FantasyTeam = mongoose.model("FantasyTeam", fantasyTeamSchema);
export default FantasyTeam;


