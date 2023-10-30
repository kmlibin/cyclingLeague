import React from "react";
//bootstrap
import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <Spinner
      animation='border' role="status" style =
      {{
        width: "100px",
        height: "100px",
        margin: "auto",
        marginTop: "1rem",
        display: "block",
      }}>
    </Spinner>
  );
};

export default Loader;