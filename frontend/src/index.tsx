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
import Roster from "./screens/Roster";
import CyclistScreen from "./screens/CyclistScreen";
import TeamScreen from './screens/TeamScreen';
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AllTeamsScreen from "./screens/AllTeamsScreen";
import PrivateRoute from "./components/PrivateRoute";
import DashboardScreen from "./screens/DashboardScreen";
import FantasyTeamsScreen from "./screens/FantasyTeamsScreen";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Roster />} />
      <Route path="/search/:keyword" element={<Roster />} />
      <Route path="/riders/:tab" element={<Roster />} />
      <Route path="/riders/:tab/search/:keyword" element={<Roster />} />
      <Route path="/cyclist/:name" element={<CyclistScreen />} />
      <Route path="/teams" element={<AllTeamsScreen />} />
      <Route path="/teams/:name" element={<TeamScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/users/:id/dashboard" element={<DashboardScreen />} />
      <Route path="/fantasyteams" element={<FantasyTeamsScreen />} />
  
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
