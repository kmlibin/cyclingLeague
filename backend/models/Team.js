import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  cyclists: 
   [ {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cyclist",
    }],
});



const Team = mongoose.model("Team", teamSchema);
export default Team;

