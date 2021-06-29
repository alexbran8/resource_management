import React from "react";
import HomePage from "./components/Homepage.jsx";
import NormCheck from './components/NormCheck'
import { HashRouter, BrowserRouter as Router, Route } from "react-router-dom";
import {config} from "./config"
import { signUpForm } from './components/SignUp'

export const AppRouter = () => {
  return (
    <HashRouter>
        <HomePage />
        <Route exact path={"/normcheck/"} component={NormCheck} />
        <Route exact path={ "/signup"} component={signUpForm} />
    </HashRouter>
  );
};
