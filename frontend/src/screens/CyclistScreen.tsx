import React from "react";
import { useParams } from "react-router-dom";

//api
import { useGetSingleCyclistQuery } from "../slices/cyclistApiSlice";

//components
import CyclistData from "../components/CyclistDataCards/CyclistData";
import Loader from "../components/Loader";

const CyclistScreen: React.FC = () => {
  const { name } = useParams();
  //need to decode the names...right now, it's passed as tadej%20Pogacar because spaces are dumb. but i'd rather use rider name than id
  const decodedName = decodeURIComponent(name || "");
  const {
    data: cyclist,
    isLoading,
    error: dataError,
  } = useGetSingleCyclistQuery<any>(decodedName);

  return (
    <div className="d-flex justify-content-center">
      {isLoading && <Loader />}
      {dataError && (
        <div style={{ width: "100%", height: "100%", textAlign: "center" }}>
          {dataError?.data.msg}
        </div>
      )}
      {cyclist && <CyclistData cyclistData={cyclist} />}
    </div>
  );
};

export default CyclistScreen;
