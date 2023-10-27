import React from "react";

interface ServerError {
  data: {
    msg: string;
  };
  status: number;
}

type ErrorProps = {
  error: ServerError
};
const Error: React.FC<ErrorProps> = ({ error: teamError }) => {
  return (
    <div style={{ width: "100%", height: "100%", textAlign: "center" }}>
      {teamError?.data.msg}
    </div>
  );
};

export default Error;
