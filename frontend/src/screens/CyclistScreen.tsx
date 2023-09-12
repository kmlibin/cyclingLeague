import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetSingleCyclistQuery } from "../slices/cyclistApiSlice";

import { Cyclist } from "../interfaces/Cyclist";

import CyclistData from "../components/CyclistData";

const CyclistScreen: React.FC = () => {
  const { name } = useParams();
  //need to decode the names...right now, it's passed as tadej%20Pogacar because spaces are dumb. but i'd rather use rider name than id
  const decodedName = decodeURIComponent(name || "");
  const { data: cyclist } = useGetSingleCyclistQuery(decodedName);
  console.log(cyclist);
  return <>{cyclist && <CyclistData cyclistData={cyclist} />}</>;
};

export default CyclistScreen;
