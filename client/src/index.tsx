import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './main.scss'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import reducers from './redux/reducers/index'
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { config } from "./config"

import { composeWithDevTools } from "redux-devtools-extension";

const userName = sessionStorage.getItem('email'),
  role = JSON.parse(sessionStorage.getItem('permisiuni')),
  name = sessionStorage.getItem('name'),
  user = sessionStorage.getItem('userEmail'),
  jwtToken = sessionStorage.getItem('id'),
  nokiaid = sessionStorage.getItem('nokiaid')

  const apiclient = new ApolloClient({ uri: config.baseURL + config.baseLOCATION + `/graphql`, });

ReactDOM.render(  <ApolloProvider client={apiclient}><Provider
    store={createStore(
        reducers,
        {
            auth: {
                name: name ? name : '',
                userName: userName ? userName : '',
                role: role ? role : '',
                user: user,
                token: jwtToken,
                nokiaid: nokiaid,
                isAuthenticated: user ? true : false
            }
        },
        composeWithDevTools(applyMiddleware(reduxThunk))
    )}
><App /> </Provider></ApolloProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
