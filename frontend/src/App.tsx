import React from "react";
import { Outlet, useLocation } from "react-router-dom";

//styles
import "bootstrap/dist/css/bootstrap.min.css";

//components
import NavBar from "./components/NavBar";


const App = () => {
  const location = useLocation();
  const homeRoute = location.pathname === "/"
  
  return (
    <>
      {!homeRoute && <NavBar />}
      <Outlet />
    </>
  );
};

export default App;
