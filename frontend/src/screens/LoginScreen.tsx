import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import FormContainer from "../components/FormContainer";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useAppSelector((state) => state.auth);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  //will find if there is 'redirect' in url, if so it will set it as 'redirect', otherwise '/'
  const redirect = searchParams.get("redirect") || "/";

   //if user info exists, we are going to navigate to the redirect
   useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //login and redirect
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      console.log(err);
    }
  };

  return (
   <FormContainer>
    <h1>Sign In</h1>

    <Form onSubmit={submitHandler}>
      <Form.Group controlId="email" className="my-3">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          placeholder="enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Form.Group controlId="password" className="my-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Button
        type="submit"
        variant="primary"
        className="mt-2"
        disabled={isLoading}
      >
        Sign In
      </Button>
      {/* {isLoading && <Loader />} */}
    </Form>
    <Row className="py-3">
      <Col>
        New Customer?{" "}
        <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
          Register
        </Link>
      </Col>
    </Row>
  </FormContainer>
  );
};

export default LoginScreen;
