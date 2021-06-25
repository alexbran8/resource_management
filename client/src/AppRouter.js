import React from "react";
import HomePage from "./components/Homepage.jsx";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {config} from "./config"

export const AppRouter = () => {
  return (
    <Router>
      <div>
        <Route exact path={config.baseLOCATION + "/"} component={HomePage} />
      </div>
    </Router>
  );
};
