import React from "react";

//interfaces and types
import { ServerError } from "../interfaces/ServerError";

type ErrorProps = {
  error: ServerError;
};
const Error: React.FC<ErrorProps> = ({ error }) => {
  return <div className="error">{error?.data.msg}</div>;
};

export default Error;
