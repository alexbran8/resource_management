import React from "react";
import HomePage from "./components/Homepage.jsx";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {config} from "./config"
import { signUpForm } from './components/SignUp'

export const AppRouter = () => {
  return (
    <Router>
      <div>
        <HomePage />
        {/* <Route exact path={config.baseLOCATION + "/"} component={HomePage} /> */}
        <Route exact path={config.baseLOCATION + "/signup"} component={signUpForm} />
      </div>
    </Router>
  );
};
