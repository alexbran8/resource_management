import React from "react";
import Homepage from "./components/Homepage.jsx";
import {Header} from "./components/Header.jsx";
import Request from "./components/Request";
import Approvals from "./components/Approval";
import NormCheck from './components/NormCheck'
import Exports from './components/Exports'
import Calendar from './components/Calendar.js'
import Norms from './components/Norms'
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
        <Route  path={ "/normcheck/"} component={authGuard(NormCheck)} />
        <Route  path={"/exports"} component={authGuard(Exports)} />
        <Route  path={"/norms"} component={authGuard(Norms)} />
        <Route  path={ "/tasks/"} component={authGuard(Tasks)} />
        <Route path={ "/approvals"} component={authGuard(Approvals)} />
        <Route  path={ "/request/"} component={authGuard(Request)} />
        <Route  path={ "/signup"} component={authGuard(signUpForm)} />
        <Route  path={"/schedule"} component={authGuard(Calendar)} />
    </HashRouter>
  );
};
