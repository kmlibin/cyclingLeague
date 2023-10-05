import Cyclist from "../models/Cyclist.js";

export const calculateTotalPoints = async (cyclistIds) => {
  let totalPoints = 0;

  // iterate through cyclistIds and sum their currentUciPoints
  for (const cyclistId of cyclistIds) {
    const cyclist = await Cyclist.findById(cyclistId);
    if (cyclist) {
      totalPoints += Number(cyclist.currentUciPoints);
    }

  }

  return totalPoints;
};

export default calculateTotalPoints;
