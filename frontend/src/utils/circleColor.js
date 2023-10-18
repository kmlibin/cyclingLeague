
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
        circleStyle.backgroundColor = "#cc0000";
        break;
      case "Sprint":
        circleStyle.backgroundColor = "#009900";
        break;
      case "Time trial":
        circleStyle.backgroundColor = "#51d5eb";
        break;
      case "Climber":
        circleStyle.backgroundColor = "#ffa500";
        break;

      default:
        circleStyle.backgroundColor = "transparent";
        break;
    }

    return <div style={circleStyle}></div>;
  };

  export default getColorCircle