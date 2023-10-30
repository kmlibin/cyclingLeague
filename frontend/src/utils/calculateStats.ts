import { addSharedRiders } from "../slices/cyclistSlice";
import { LeagueData } from "../interfaces/League";
import { Cyclist } from "../interfaces/Cyclist";


export const calculatePrice = (prevPoints: number) => {
  const psRatio = 0.00816;
  //round to the nearest number, but will always at least be 1
  const price = Math.max(1, Math.round(prevPoints * psRatio));
  return price;
};

//type these
export const findSharedRiders = (
  dispatch: any,
  team: any,
  league: any,
  userId: string | null
) => {
  if (team && league) {
    //find users team id
    const usersTeamId = team._id;
    //get cyclists ids from users team
    const teamCyclistIds = team.cyclists.map((cyclist: Cyclist) => cyclist._id);

    // grab index of the logged-in user's team within league.teamIds, need to exclude it for calculation
    const usersTeamIndex = league.teamIds.findIndex(
      (teamData: LeagueData) => teamData._id === usersTeamId
    );

    // create a copy of league.teamIds without the user's team
    const filteredLeagueTeamIds = [
      ...league.teamIds.slice(0, usersTeamIndex),
      ...league.teamIds.slice(usersTeamIndex + 1),
    ];

    // grab cyclist _ids from the remaining teams in the league
    const leagueCyclistIds = filteredLeagueTeamIds
      .flatMap((teamData: any) => teamData.cyclists)
      //gets ids
      .map((cyclistId: string) => cyclistId);

    const sharedCyclistIds = teamCyclistIds.filter((teamCyclistId: any) =>
      leagueCyclistIds.includes(teamCyclistId)
    );

    //shared cyclist _ids excluding the logged-in user's team
    const sharedCyclists = team.cyclists.filter((cyclist: any) =>
      sharedCyclistIds.includes(cyclist._id)
    );
    dispatch(addSharedRiders({ user: userId, sharedRiders: sharedCyclists }));
  }
};

export const cyclistsPerSpecialty = (team: any) => {
  const counts = {
    sprinters: 0,
    climbers: 0,
    timetrial: 0,
    oneday: 0,
  };
  if (team) {
    const { cyclists } = team;

    cyclists.forEach((cyclist: Cyclist) => {
      switch (cyclist.mainSpecialty) {
        case "Sprint":
          counts.sprinters++;
          break;
        case "Climber":
          counts.climbers++;
          break;
        case "Time trial":
          counts.timetrial++;
          break;
        case "One day races":
          counts.oneday++;
          break;
      }
    });
  }
  return counts;
};

export const highScore = (team: any) => {
  if (team) {
    const { cyclists } = team;

    let score = 0;
    let topCyclist: Cyclist | null = null;
    //check the current uci points of each cyclist, store highest one in state
    for (const cyclist of cyclists) {
      if (Math.floor(cyclist.currentUciPoints) > Math.floor(score)) {
        score = cyclist.currentUciPoints;
        topCyclist = cyclist;
      }
    }
    return topCyclist;
  }
  return null;
};

export const bestValueCyclist = (team: any) => {
  if (team) {
    //grab cyclists
    const { cyclists } = team;
    let bestValue = 0;
    let bestValueCyclist = null;
    for (const cyclist of cyclists) {
      //calculate how much they cost the user to put on team
      const price = calculatePrice(cyclist.yearEndUciPoints);
      //find ratio of how many points they've so far vs how much they cost
      const value = cyclist.currentUciPoints / price;
      //will put the cyclist with highest value in state
      if (value > bestValue) {
        bestValue = value;
        bestValueCyclist = cyclist;
      }
    }
    return bestValueCyclist;
  }
};

export const worstValueCyclist = (team: any) => {
  if (team) {
    // Grab cyclists
    const { cyclists } = team;
    let worstValue = Infinity; // Initialize worstValue with a very high value
    let worstValueCyclist = null;
    for (const cyclist of cyclists) {
      // Calculate how much they cost the user to put on the team
      const price = calculatePrice(cyclist.yearEndUciPoints);
      if (price !== 1) {
        // Find the ratio of how many points they've earned so far vs how much they cost
        const value = cyclist.currentUciPoints / price;
        // Check if this cyclist has a worse value than the current worstValue
        if (value < worstValue) {
          worstValue = value;
          worstValueCyclist = cyclist;
        }
      }
    }
    return worstValueCyclist;
  }
};

type SpecialtyData = {
  specialty: string;
  points: number;
};

export const teamSpecialties = (team: any) => {
  let data: SpecialtyData[] = [
    { specialty: "One day races", points: 0 },
    { specialty: "GC", points: 0 },
    { specialty: "Time trial", points: 0 },
    { specialty: "Sprint", points: 0 },
    { specialty: "Climber", points: 0 },
  ];

  if (team) {
    const { cyclists } = team;
    for (const cyclist of cyclists) {
      for (const specialtyObject of cyclist.riderSpecialties) {
        //find the right object in the data and update its points
        const matchingSpecialty = data.find(
          (item) => item.specialty === specialtyObject.specialty
        );
        if (matchingSpecialty) {
          matchingSpecialty.points += specialtyObject.points;
        }
      }
    }
  }
  return data;
};
