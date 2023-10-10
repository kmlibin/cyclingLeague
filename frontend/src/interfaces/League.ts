import { Cyclist } from "./Cyclist";

export interface LeagueData {
  name: string;
  teamIds: {
    cyclists: Cyclist[];
    owner: {
      _id: string;
      name: string;
    };
  };
  teamName: string;
  totalPoints: number | string;
  _id: string;
}
