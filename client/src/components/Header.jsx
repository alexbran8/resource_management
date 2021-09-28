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
    fetch(config.baseURL + config.baseLOCATION + "/auth/login/success/", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
      .then(response => {
        if (response.status === 200) return response.json();
        throw new Error("failed to authenticate user");
      })
      .then(responseJson => {
        console.log(responseJson)
        setState({
          authenticated: true,
          user: responseJson.user
        });
        sessionStorage.setItem('exp', responseJson.user.exp)
        sessionStorage.setItem('userEmail', responseJson.user.email)
        sessionStorage.setItem('name', responseJson.user.first_name)
        sessionStorage.setItem('token', responseJson.user.id)
        sessionStorage.setItem('roles', responseJson.user.roles)
        dispatch({
          type: UPDATE_PROFILE,
          payload: {
            role: responseJson.user.roles,
            name: responseJson.user.first_name,
            email: responseJson.user.email,
            token: responseJson.user.id
          },

        })
          .catch(error => {
            setState({
              authenticated: false,
              error: "Failed to authenticate user"
            });
            console.log(error)
          });

      }
      );
  }, [])
  //     // Fetch does not send cookies. So you should add credentials: 'include'
  //     fetch( config.baseURL + config.baseLOCATION + "/auth/login/success/", {
  //       method: "GET",
  //       credentials: "include",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Credentials": true
  //       }
  //     })
  //       .then(response => {
  //         if (response.status === 200) return response.json();
  //         throw new Error("failed to authenticate user");
  //       })
  //       .then(responseJson => {
  //         this.setState({
  //           authenticated: true,
  //           user: responseJson.user
  //         });

  //            // save to localstorage and redux

  //            sessionStorage.setItem('userEmail', responseJson.user.email)
  //            sessionStorage.setItem('exp', responseJson.user.exp)
  //            sessionStorage.setItem('token', responseJson.user.id)
  //            sessionStorage.setItem('name', responseJson.user.first_name)
  //            sessionStorage.setItem('userEmail', responseJson.user.email)
  //            sessionStorage.setItem('roles', responseJson.user.roles)

  //         console.log(responseJson)
  //         return async dispatch => {
  //            dispatch({
  //         type: AUTH_SIGN_IN,
  //         payload: responseJson.user.id,
  //         payload_role: responseJson.user.role,
  //         payload_email: responseJson.user.email,
  //         payload_name: responseJson.user.first_name,
  //         payload_nokiaid: responseJson.user.sub
  //       })
  //     }

  // const { authenticated, user } = this.state;

  const _handleSignInClick = () => {
    // Authenticate using via passport api in the backend
    // Open Twitter login page
    // Upon successful login, a cookie session will be stored in the client
    window.open(config.baseURL + config.baseLOCATION + "/auth/twitter", "_self");
  };

  const _handleLogoutClick = () => {
    // Logout using Twitter passport api
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




