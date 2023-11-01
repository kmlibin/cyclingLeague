import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";

//local imports
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/index.css";

//components
import App from "./App";
import CyclistScreen from "./screens/CyclistScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AllTeamsScreen from "./screens/ProTeamsListScreen/AllTeamsScreen";
import DashboardScreen from "./screens/UserDashboard/DashboardScreen";
import FantasyTeamsListScreen from "./screens/FantasyTeamsListScreen";
import RidersOnTeamScreen from "./screens/ShowCyclists";
import CreateFantasyTeam from "./screens/CreateFantasyTeam/CreateFantasyTeam";
import LandingScreen from "./screens/LandingScreen/LandingScreen";
import PrivateRoute from "./components/PrivateRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<LandingScreen />} />
      <Route path="/createteam" element={<CreateFantasyTeam />} />
      <Route
        path="/createteam/:tab?/search/:keyword?"
        element={<CreateFantasyTeam />}
      />
      <Route path="/cyclists" element={<CreateFantasyTeam />} />
      <Route
        path="/cyclists/:tab?/search/:keyword?"
        element={<CreateFantasyTeam />}
      />
      <Route path="/cyclist/:name" element={<CyclistScreen />} />
      <Route path="/teams" element={<AllTeamsScreen />} />
      <Route path="/teams/page/:pageNumber" element={<AllTeamsScreen />} />
      <Route path="/teams/:teamId" element={<RidersOnTeamScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />

      {/* private routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/users/:id/dashboard" element={<DashboardScreen />} />
        <Route path="/createleague" element={<FantasyTeamsListScreen />} />
        <Route path="/fantasyteams" element={<FantasyTeamsListScreen />} />
        <Route path="/fantasyteams/:name" element={<RidersOnTeamScreen />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
