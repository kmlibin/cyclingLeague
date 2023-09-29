import React from "react";
import { Outlet } from "react-router-dom";

import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css'
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <>
    <NavBar />
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  );
};

export default App;
