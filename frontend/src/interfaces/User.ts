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
  