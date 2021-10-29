import React from "react";
import Homepage from "./components/Homepage.jsx";
import {Header} from "./components/Header.jsx";
import {RequestParent} from "./components/Request/RequestParent";
import Approvals from "./components/Approval/Approval.js";
import NormCheck from './components/NormCheck/NormCheck'
import Exports from './components/Exports'
import LoginError from "./components/LoginError";
import Calendar from './components/Calendar.js'
import Norms from './components/Norms'
import Tasks from './components/Tasks.js'
import {HowTo} from './components/howTo/howTo'
import { HashRouter,Route } from "react-router-dom";
// import  SignUpForm  from './components/SignUp'
import {config} from "./config"
import authGuard from "./HOCs/authGuard.js";
import  {InvoiceCheck}  from "./components/invoiceCheck/InvoiceCheck";
import { AddUsers } from "./components/AddUsers/addUsers";

export const AppRouter = () => {
  return (
    <HashRouter  >
        <Header basename={config.baseLOCATION}/>
        <Route  exact path={"/"} component={Homepage} />
        <Route exact path={"/error"} component={LoginError} />
        <Route  path={ "/normcheck/"} component={authGuard(NormCheck)} />
        <Route  path={"/exports"} component={authGuard(Exports)} />
        <Route  path={"/norms"} component={authGuard(Norms)} />
        <Route  path={ "/tasks/"} component={authGuard(Tasks)} />
        <Route path={ "/approvals"} component={authGuard(Approvals)} />
        <Route  path={ "/request/"} component={authGuard(RequestParent)} />
        <Route  path={ "/signup"} component={authGuard(AddUsers)} />
        <Route  path={"/schedule"} component={authGuard(Calendar)} />
        <Route  path={"/howto"} component={authGuard(HowTo)} />
        <Route  path={"/invoicecheck"} component={authGuard(InvoiceCheck)} />
        {/* <Route  path={"/invoicecheck"} component={authGuard(InvoiceCheckTool)} /> */}
    </HashRouter>
  );
};
