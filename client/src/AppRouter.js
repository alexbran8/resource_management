import React from "react";
import { HomePage } from "./components/HomePage/HomePage";
import { Header } from "./components/Header/Header";
import { RequestParent } from "./components/Request/RequestParent";

import Exports from './components/Exports/Exports'
import LoginError from "./components/LoginError";
import Calendar from './components/Calendar'
import Norms from './components/Norms'
import { Tasks } from './components/Tasks/Tasks'
import { HowTo } from './components/howTo/howTo'
import { HashRouter, Route } from "react-router-dom";
// import  SignUpForm  from './components/SignUp'
import { config } from "./config"
import authGuard from "./HOCs/authGuard.js";

import { AddUsers } from "./components/AddUsers/addUsers";
// import { AlertComponent } from "./components/common/Alert/Alerts";
import {ErrorBoundary} from 'react-error-boundary'

const NormCheck = React.lazy(async () => {
  let obj = await import(/* webpackChunkName: "norm_check" */ "./components/NormCheck/NormCheck")
  return typeof obj.default === 'function'?obj:obj.default
  }
)

const Approvals = React.lazy(async () => {
  let obj = await import(/* webpackChunkName: "approval_component" */ "./components/Approvals/Approval")
  return typeof obj.default === 'function'?obj:obj.default
  }
)

const InvoiceCheck = React.lazy(async () => {
  let obj = await import(/* webpackChunkName: "invoice_check" */ "./components/invoiceCheck/InvoiceCheck")
  return typeof obj.default === 'function'?obj:obj.default
  }
)


function ErrorHandler({error}) {
  return (
    <div role="alert">
      <p>An error occurred:</p>
      <pre>{error.message}</pre>
    </div>
  )
}


export const AppRouter = () => {
  return (
    <HashRouter  >
       <Header basename={config.baseLOCATION} />
      <ErrorBoundary FallbackComponent={ErrorHandler}>
      <React.Suspense fallback={<h1>Loading...</h1>}>
      {/* <AlertComponent
        messages={[{ message: 'navbar has been updated', type: 'success' }, 
        { message: 'alert bar updated', type: 'success' },
        //  { message: '[planned update] review form options', type: 'info' }
        ]}
      /> */}
      <Route exact path={"/"} component={HomePage} />
      <Route exact path={"/error"} component={LoginError} />
      <Route path={"/normcheck/"} component={authGuard(NormCheck)} />
      <Route path={"/exports"} component={authGuard(Exports)} />
      <Route path={"/norms"} component={authGuard(Norms)} />
      <Route path={"/tasks/"} component={authGuard(Tasks)} />
      <Route path={"/approvals"} component={authGuard(Approvals)} />
      <Route path={"/add/"} component={authGuard(RequestParent)} />
      <Route path={"/add-users"} component={authGuard(AddUsers)} />
      <Route path={"/schedule"} component={authGuard(Calendar)} />
      <Route path={"/howto"} component={authGuard(HowTo)} />
      <Route path={"/invoicecheck"} component={authGuard(InvoiceCheck)} />
      {/* <Route  path={"/invoicecheck"} component={authGuard(InvoiceCheckTool)} /> */}
      </React.Suspense>
      </ErrorBoundary>
    </HashRouter>
  );
};
