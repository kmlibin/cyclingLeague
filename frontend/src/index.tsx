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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Roster />} />
      <Route path="/search/:keyword" element={<Roster />} />
      <Route path="/riders/:tab" element={<Roster />} />
      <Route path="/riders/:tab/search/:keyword" element={<Roster />} />
      <Route path="/cyclist/:name" element={<CyclistScreen />} />
      <Route path="/teams/:name" element={<TeamScreen />} />
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
