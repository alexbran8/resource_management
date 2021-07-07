import React from "react";
import Homepage from "./components/Homepage.jsx";
import Header from "./components/Header.jsx";
import Request from "./components/Request";
import Approvals from "./components/Approval";
import NormCheck from './components/NormCheck'
import Calendar from './components/Calendar.js'
import Main from './components/Main.js'
import Tasks from './components/Tasks.js'
import { HashRouter,Route } from "react-router-dom";
import { signUpForm } from './components/SignUp'
import {config} from "./config"
import authGuard from "./HOCs/authGuard.js";

export const AppRouter = () => {
  return (
    <HashRouter  >
        <Header basename={config.baseLOCATION}/>
        <Route  exact path={"/"} component={Homepage} />
        <Route  path={config.baseLOCATION + "/normcheck/"} component={authGuard(NormCheck)} />
        <Route  path={config.baseLOCATION + "/tasks/"} component={authGuard(Tasks)} />
        <Route path={config.baseLOCATION + "/approvals"} component={authGuard(Approvals)} />
        <Route  path={config.baseLOCATION + "/request/"} component={authGuard(Request)} />
        <Route  path={config.baseLOCATION + "/signup"} component={authGuard(signUpForm)} />
        <Route  path={config.baseLOCATION + "/schedule"} component={authGuard(Calendar)} />
    </HashRouter>
  );
};
