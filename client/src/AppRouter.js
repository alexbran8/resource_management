import React from "react";
import HomePage from "./components/HomePage.jsx";
import Header from "./components/Header.jsx";
import NormCheck from './components/NormCheck'
import Calendar from './components/Calendar.js'
import { HashRouter,Route } from "react-router-dom";
import { signUpForm } from './components/SignUp'

export const AppRouter = () => {
  return (
    <HashRouter  >
        <Header />``
        <Route  path={"/home/"} component={HomePage} />
        <Route  path={"/normcheck/"} component={NormCheck} />
        <Route  path={"/signup"} component={signUpForm} />
        <Route  path={"/schedule"} component={Calendar} />
    </HashRouter>
  );
};
