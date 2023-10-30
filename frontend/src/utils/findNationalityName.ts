//what's saved in the db doesn't always work with react flags/ codes, so need to convert

const mapNationalityName = (nationalityName: string) => {
  switch (nationalityName) {
    case "Great Britain":
      return "United Kingdom of Great Britain and Northern Ireland";
    case "Russia":
      return "Russian Federation";
    case "United States":
      return "United States of America";
    case "Turkey":
      return "Türkiye";
    case "Czech Republic":
      return "Czechia";
    default:
      return nationalityName;
  }
};

export default mapNationalityName;
