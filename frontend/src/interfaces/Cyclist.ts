export interface Cyclist {
    _id: string;
    name: string;
    imageSrc: string;
    nationality: string;
    nationalityName: string;
    riderSpecialties: [ {
        specialty: string;
        points: number;
    }],
    team: string,
    yearEndUciPoints: number;
    currentUciPoints?: number
  }