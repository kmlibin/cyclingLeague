  //split this off into a different file
   const getColorCircle = (mainSpecialty) => {
    const circleSize = "20px"; // Adjust the size as needed
    const circleStyle = {
      width: circleSize,
      height: circleSize,
      backgroundColor: "transparent",
      borderRadius: "50%",
      display: "inline-block",
    };

    switch (mainSpecialty) {
      case "One day races":
        circleStyle.backgroundColor = "#ffa500";
        break;
      case "Sprint":
        circleStyle.backgroundColor = "#009900";
        break;
      // Add more cases for other specialties if needed
      case "Time trial":
        circleStyle.backgroundColor = "#51d5eb";
        break;
      case "Climber":
        circleStyle.backgroundColor = "#cc0000";
        break;

      default:
        circleStyle.backgroundColor = "transparent";
        break;
    }

    return <div style={circleStyle}></div>;
  };

  export default getColorCircle