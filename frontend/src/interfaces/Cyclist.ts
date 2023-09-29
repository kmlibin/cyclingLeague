export interface Cyclist {
  _id: string;
  name: string;
  yearEndRanking: number;
  imageSrc: string;
  nationality: string;
  nationalityName: string;
  socialUrls: [{ icon: string; href: string }];
  riderSpecialties: [
    {
      specialty: string;
      points: number;
    }
  ];
  mainSpecialty: string;
  team: string;
  yearEndUciPoints: number;
  currentUciPoints?: number;
}

export interface FantasyTeam {
  _id: string;
  teamName: string;
  owner: string;
  cyclists: Cyclist[];
}

export interface User {
  name: string;
  email: string;
  _id: string;
  isAdmin: boolean;
  fantasyTeam: {
    cyclists: string[];
    teamName: string;
  };
}
