import React from "react";
import { useParams } from "react-router-dom";

//api
import { useGetSingleCyclistQuery } from "../slices/cyclistApiSlice";

//components
import CyclistData from "../components/CyclistDataCards/CyclistData";

const CyclistScreen: React.FC = () => {
  const { name } = useParams();
  //need to decode the names...right now, it's passed as tadej%20Pogacar because spaces are dumb. but i'd rather use rider name than id
  const decodedName = decodeURIComponent(name || "");
  const { data: cyclist } = useGetSingleCyclistQuery(decodedName);

  return <>{cyclist && <CyclistData cyclistData={cyclist} />}</>;
};

export default CyclistScreen;
