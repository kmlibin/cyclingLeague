import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
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
