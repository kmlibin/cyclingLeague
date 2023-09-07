import mongoose from "mongoose";

const specialtySchema = new mongoose.Schema({
  specialty: String,
  points: Number,
});

const socialMediaSchema = new mongoose.Schema({
  icon: String,
  href: String,
});

const cyclistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    team: {
      type: String,
      required: true,
    },
    yearEndRanking: {
      type: Number
    },
    nationality: {
      type: String,
      required: true,
    },
    nationalityName: {
      type: String,
      required: true,
    },
    socialUrls: {
      type: [socialMediaSchema],
    },
    riderSpecialties: {
      type: [specialtySchema],
      required: true,
    },
    mainSpecialty: {
      type: String,
      required: true,
    },
    imageSrc: {
      type: String,
    },
    yearEndUciPoints: {
      type: Number,
      required: true,
    },
    currentUciPoints: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Cyclist = mongoose.model("Cyclist", cyclistSchema);
export default Cyclist;
