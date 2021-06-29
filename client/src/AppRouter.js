import React from "react";
import HomePage from "./components/Homepage.jsx";
import Header from "./components/Header.jsx";
import NormCheck from './components/NormCheck'
import Calendar from './components/Calendar.js'
import { HashRouter,Route } from "react-router-dom";
import { signUpForm } from './components/SignUp'
import {config} from "./config"

export const AppRouter = () => {
  return (
    <HashRouter  >
        <Header basename={config.baseLOCATION}/>
        <Route  path={"/home/"} component={HomePage} />
        <Route  path={config.baseLOCATION + "/normcheck/"} component={NormCheck} />
        <Route  path={config.baseLOCATION + "/signup"} component={signUpForm} />
        <Route  path={config.baseLOCATION + "/schedule"} component={Calendar} />
    </HashRouter>
  );
};
