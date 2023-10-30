import React from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

//api and redux
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";

//libraries
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);

  const id = typeof userInfo === "object" ? userInfo._id : null;
  const userName = typeof userInfo === "object" ? userInfo.name : null;
  const myTeam = typeof userInfo === "object" ? userInfo.fantasyTeam : null;

  // console.log(userInfo);
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall(undefined).unwrap();
      dispatch(logout(undefined));
      navigate("/");
    } catch (error) {}
  };
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Cycling League</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/cyclists">
              <Nav.Link>Cyclists</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/teams">
              <Nav.Link>Teams</Nav.Link>
            </LinkContainer>
            {!userInfo && (
               <LinkContainer to="/login">
               <Nav.Link>Login</Nav.Link>
             </LinkContainer>
            )}
            {!userInfo && (
               <LinkContainer to="/register">
               <Nav.Link>Register</Nav.Link>
             </LinkContainer>
            )}
            {userInfo && (
              <LinkContainer to="/fantasyteams">
                <Nav.Link>Fantasy Teams</Nav.Link>
              </LinkContainer>
            )}
            {userInfo && (
              <NavDropdown
                title={`Welcome ${userName}`}
                id="basic-nav-dropdown"
              >
                <LinkContainer to={`/users/${id}/dashboard`}>
                  <NavDropdown.Item>Dashboard</NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to={`/createteam`}>
                  <NavDropdown.Item>Build Fantasy Team</NavDropdown.Item>
                </LinkContainer>

                {myTeam ? (
                  <LinkContainer to="/createleague">
                    <NavDropdown.Item>Build Fantasy League</NavDropdown.Item>
                  </LinkContainer>
                ) : (
                  <NavDropdown.Item className="disabled-link" style={{color: "lightgrey"}}>
                    Build Fantasy League
                  </NavDropdown.Item>
                )}

                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logoutHandler}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
