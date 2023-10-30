import React from "react";
import { Outlet, Navigate } from "react-router-dom";
//rtk and api
import { useAppSelector } from "../hooks/hooks"

const PrivateRoute = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to ='/login' replace/>
};

export default PrivateRoute;