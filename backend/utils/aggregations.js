import Cyclist from "../models/Cyclist.js";
import Team from "../models/Team.js";

//create team db from an aggregation of cyclists. in backend, i populate cyclist stats based on ids
export const createTeamData = async () => {
  try {
    const teams = await Cyclist.aggregate([
      {
        $group: {
          _id: "$team",
          cyclists: {
            $push: "$_id", // Push the ObjectIds of cyclists
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // save the populated teams to the Team collection
    await Team.insertMany(teams);
    console.log("teams created!");
  } catch (error) {
    console.error("Error creating teams:", error);
  }
};
export default createTeamData;
