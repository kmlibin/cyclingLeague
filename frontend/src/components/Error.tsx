import React from "react";
//interfaces and types
import { ServerError } from "../interfaces/ServerError";

type ErrorProps = {
  error: ServerError
};
const Error: React.FC<ErrorProps> = ({ error }) => {
  return (
    <div style={{ width: "100%", height: "100%", textAlign: "center" }}>
      {error?.data.msg}
    </div>
  );
};

export default Error;
