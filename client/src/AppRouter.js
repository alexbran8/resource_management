import React from "react";
import Homepage from "./components/Homepage.jsx";
import Header from "./components/Header.jsx";
import Request from "./components/Request";
import Approvals from "./components/Approval";
import NormCheck from './components/NormCheck'
import Calendar from './components/Calendar.js'
import Tasks from './components/Tasks.js'
import { HashRouter,Route } from "react-router-dom";
import { signUpForm } from './components/SignUp'
import {config} from "./config"

export const AppRouter = () => {
  return (
    <HashRouter  >
        <Header basename={config.baseLOCATION}/>
        <Route  path={"/home/"} component={Homepage} />
        <Route  path={config.baseLOCATION + "/normcheck/"} component={NormCheck} />
        <Route  path={config.baseLOCATION + "/tasks/"} component={Tasks} />
        <Route path={config.baseLOCATION + "/approvals"} component={Approvals} />
        <Route  path={config.baseLOCATION + "/request/"} component={Request} />
        <Route  path={config.baseLOCATION + "/signup"} component={signUpForm} />
        <Route  path={config.baseLOCATION + "/schedule"} component={Calendar} />
    </HashRouter>
  );
};
