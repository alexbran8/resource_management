import React from "react";
import HomePage from "./components/Homepage.jsx";
import NormCheck from './components/NormCheck'
import Calendar from './components/Calendar.js'
import { HashRouter,Route } from "react-router-dom";
import {config} from "./config"
import { signUpForm } from './components/SignUp'

export const AppRouter = () => {
  return (
    <HashRouter  >
        <HomePage />
        {/* <Route exact path={config.baseLOCATION + "/"} component={HomePage} /> */}
        <Route path={"/normcheck/"} component={NormCheck} />
        <Route exact path={"/signup"} component={signUpForm} />
        <Route path={"/schedule"} component={Calendar} />
    </HashRouter>
  );
};
