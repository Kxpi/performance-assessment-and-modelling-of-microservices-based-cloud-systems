import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AppGroups from "./AppGroups";
import NewHomePage from "./NewHomePage"
import HomePage from './HomePage'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* skrot do komentarzy ctrl+k+c, do cofania komentarzy ctrl+k+u*/}
    {/* <AppGroups /> */}
    {/* <NewApp /> */}
    {/* <HomePage /> */}

    {/* New Interface playground */}
    <NewHomePage />
  </React.StrictMode>
);

