
import FantasyTeam from "../models/FantasyTeam.js";
import Cyclist from "../models/Cyclist.js";

export const recalculateTotalPoints = async (teamId) => {
  try {
    const team = await FantasyTeam.findById(teamId);
    if (!team) {
      return;
    }

    let totalPoints = 0;
    for (const cyclistId of team.cyclists) {
      const cyclist = await Cyclist.findById(cyclistId);
      if (cyclist) {
        if(!isNaN(cyclist.currentUciPoints)  && cyclist.currentUciPoints !== 'n/a') {
        totalPoints += Number(cyclist.currentUciPoints);
        }
      }
    }

    team.totalPoints = totalPoints;
    await team.save();
  } catch (error) {
    console.error(`Error calculating total points for team ${teamId}: ${error}`);
  }
};

export default recalculateTotalPoints