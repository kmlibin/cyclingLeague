import { Cyclist } from "./Cyclist";
export interface FantasyTeam {
    _id: string;
    teamName: string;
    owner: string;
    cyclists: Cyclist[];
    totalPoints: number;
  }