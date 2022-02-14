import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { config } from "../config"
import { UPDATE_PROFILE, AUTH_SIGN_IN, AUTH_SIGN_OUT, AUTH_ERROR } from '../redux/reducers/types'
import "./Header.scss"
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
  Container
} from 'reactstrap'


export const Header = () => {
  const user = useSelector((state) => ({ auth: state.auth }));
  const [state, setState] = useState([]);

  const dispatch = useDispatch()

  useEffect(() => {
    login ()
  }, [])

   // gets login details
   function login() {
    fetch(config.baseURL + config.baseLOCATION + "/auth/login/success/", {
      method: "GET",
      // body: JSON.stringify({ start: performance.now() }),
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        // "Access-Control-Allow-Origin":true
      }
    })
      .then(response => {
        if (response.status) return response.json();
        // if (response.status === 401) return response.json()
    })
      .then(responseJson => {
        console.log('here',responseJson);
        if(responseJson.success === true) {
          getIcon(responseJson.user.token)
        sessionStorage.setItem('exp', responseJson.user.exp);
        sessionStorage.setItem('token_refresh', responseJson.user.token_refresh);
        sessionStorage.setItem('userEmail', responseJson.user.email);
        sessionStorage.setItem('upalu', responseJson.user.upalu);
        sessionStorage.setItem('userName', responseJson.user.userName);
        sessionStorage.setItem('name', responseJson.user.first_name);
        sessionStorage.setItem('token', responseJson.user.token);
        sessionStorage.setItem('roles', responseJson.user.roles);

        dispatch({
          type: UPDATE_PROFILE,
          payload: {
            role: responseJson.user.roles,
            userName: responseJson.user.userName,
            name: responseJson.user.first_name,
            email: responseJson.user.email,
            upalu: responseJson.user.upalu,
            token: responseJson.user.token
          }
      }
      );
      setState({
        authenticated: true,
        user: responseJson.user
      });
    }
    else 
    {
      setState({
        authenticated: false,
        error: "Failed to authenticate user"
      });
    }
  }
    
      )
      .catch(err => {
        setState({
          authenticated: false,
          error: "Failed to authenticate user"
        });
        console.log(err);
        _handleLogoutClick();
      });
  }

  const _handleSignInClick = () => {
    // Authenticate using via passport api in the backend
    // Open azure login page
    // Upon successful login, a cookie session will be stored in the client
    window.open(config.baseURL + config.baseLOCATION + "/auth/azure", "_self");
  };

  const _handleLogoutClick = () => {
    // Logout using azure passport api
    // Set authenticated state to false in the HomePage
    window.open(config.baseURL + config.baseLOCATION + "/auth/logout", "_self");
    sessionStorage.removeItem('exp')
    sessionStorage.removeItem('userEmail')
    sessionStorage.removeItem('name')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('roles')
    handleNotAuthenticated();
    dispatch({type: AUTH_SIGN_OUT});
  }
  const _handleNotAuthenticated = () => {
    setState({ authenticated: false });
  };
  return (
    <Navbar className="navbar sticky-nav" expand="sm" fixed="top">
      <Link className="navbar-brand text-white" to={"/"}>
        <b>NOKIA</b> {config.appversion} {config.AppName}
      </Link>
      <Collapse navbar>
        {state.authenticated ?
          <Nav navbar>
            <ul className="navbar-nav text-center">
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to={"/schedule"}
                >
                  Schedule
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to={"/norms"}
                >
                  Norms
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to={"/request"}
                >
                  Add
                </Link>
              </li>
              
              {/* <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to={ "/tasks"}
                >
                  Tasks
                </Link>
              </li> */}
            </ul>
          </Nav>
          : null}
      </Collapse>
      <div className="navbar-text">
        <Nav navbar>
          {user.auth.role === 'L3' ?
            <>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to={"/approvals"}
                >
                  Approvals
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to={"/signup"}
                >
                  Add Users
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to={ "/exports"}
                >
                  Exports
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to={"/normcheck"}
                >
                  NormCheck
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to={"/invoicecheck"}
                >
                  InvoiceCheck
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to={"/howto"}
                >
                  HowTo?
                </Link>
              </li>
            </>
            : null}
          <ul className="menu">
            {state && state.authenticated ? (
              <Button color="danger" onClick={_handleLogoutClick}>Logout {state.user.email}</Button>
            ) : (
              <Button color="primary" onClick={_handleSignInClick}>Login</Button>
            )}
          </ul>
        </Nav>
      </div>
    </Navbar>


  );
}




