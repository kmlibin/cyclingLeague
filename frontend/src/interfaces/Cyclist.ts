export interface Cyclist {
    _id: string;
    name: string;
    yearEndRanking: number
    imageSrc: string;
    nationality: string;
    nationalityName: string;
    socialUrls: [{icon: string, href: string}]
    riderSpecialties: [ {
        specialty: string;
        points: number;
    }],
    mainSpecialty: string,
    team: string,
    yearEndUciPoints: number;
    currentUciPoints?: number
  }