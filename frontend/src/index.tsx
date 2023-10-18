import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/index.css";
import App from "./App";
import Roster from "./screens/CreateFantasyTeam/CreateFantasyTeam";
import CyclistScreen from "./screens/CyclistDataScreen/CyclistScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AllTeamsScreen from "./screens/AllTeamsScreen/AllTeamsScreen";
import PrivateRoute from "./components/PrivateRoute";
import DashboardScreen from "./screens/UserDashboard/DashboardScreen";
import FantasyTeamsListScreen from "./screens/FantasyTeamsListScreen";
import TeamDataScreen from "./screens/TeamDataScreen";
import CreateFantasyTeam from "./screens/CreateFantasyTeam/CreateFantasyTeam";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<CreateFantasyTeam />} />
      <Route path="/create" element={<CreateFantasyTeam />} />  
      <Route path="/search/:keyword" element={<CreateFantasyTeam />} />
      <Route path="/riders" element={<CreateFantasyTeam />} />      
      <Route path="/riders/:tab/search/:keyword" element={<CreateFantasyTeam />} />
      <Route path="/riders/:tab" element={< CreateFantasyTeam/>} />
      <Route path="/cyclist/:name" element={<CyclistScreen />} />
      <Route path="/teams" element={<AllTeamsScreen />} />
      <Route path="/teams/page/:pageNumber" element={<AllTeamsScreen />} />
      <Route path="/teams/:teamId" element={<TeamDataScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/users/:id/dashboard" element={<DashboardScreen />} />
      <Route path="/fantasyteams" element={<FantasyTeamsListScreen />} />
      <Route path="/fantasyteams/:name" element={<TeamDataScreen />} />
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
