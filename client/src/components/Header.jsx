import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { config } from "../config"
import { AUTH_SIGN_UP, AUTH_SIGN_IN, AUTH_SIGN_OUT, AUTH_ERROR } from '../actions/types'
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

export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: null,
      lastName: null,
      loginName: null,
      isOpen: false
    }
    // state = {
    //   user: {},
    //   error: null,
    //   authenticated: false
    // };
  }
  // static propTypes = {
  //   authenticated: PropTypes.bool.isRequired,
  //   user: PropTypes.object
  // };

  componentDidMount() {
    // Fetch does not send cookies. So you should add credentials: 'include'
    fetch( config.baseURL + config.baseLOCATION + "/auth/login/success/", {
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
        this.setState({
          authenticated: true,
          user: responseJson.user
        });

           // save to localstorage and redux
           
           sessionStorage.setItem('userEmail', responseJson.user.email)
           sessionStorage.setItem('exp', responseJson.user.exp)
           sessionStorage.setItem('token', responseJson.user.id)
           sessionStorage.setItem('name', responseJson.user.first_name)
           sessionStorage.setItem('userEmail', responseJson.user.email)
           sessionStorage.setItem('roles', responseJson.user.roles)

        console.log(responseJson)
        return async dispatch => {
           dispatch({
        type: AUTH_SIGN_IN,
        payload: responseJson.user.id,
        payload_role: responseJson.user.role,
        payload_email: responseJson.user.email,
        payload_name: responseJson.user.first_name,
        payload_nokiaid: responseJson.user.sub
      })
    }

     
      })
      .catch(error => {
        this.setState({
          authenticated: false,
          error: "Failed to authenticate user"
        });
        console.log(error)
      });
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }


  render() {
    const { authenticated, user } = this.state;
    return (
      <Navbar className="navbar" expand="sm">
        <Link className="navbar-brand text-white" to={config.baseLOCATION + "/"}>
          <b>NOKIA</b> {config.appversion}
        </Link>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav navbar>
            <ul className="navbar-nav text-center">
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to={config.baseLOCATION + "/schedule"}
                >
                  Schedule
                      </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to={config.baseLOCATION + "/approvals"}
                >
                  Approvals
                      </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to={config.baseLOCATION + "/request"}
                >
                  Add
                      </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to={config.baseLOCATION + "/tasks"}
                >
                  Tasks
                      </Link>
              </li>
            </ul>
          </Nav>
        </Collapse>
        <div className="navbar-text">
          <Nav navbar>
          <li className="nav-item">
            <Link
              className="nav-link text-white"
              to={config.baseLOCATION + "/signup"}
            >
              Add Users
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-white"
              to={config.baseLOCATION + "/normcheck"}
            >
              NormCheck
            </Link>
          </li>
            <ul className="menu">
              {authenticated ? (
                <Button color="danger" onClick={this._handleLogoutClick}>Logout {user.email}</Button>
              ) : (
                <Button color="primary" onClick={this._handleSignInClick}>Login</Button>
              )}
            </ul>
          </Nav>
        </div>
      </Navbar>

    );
  }

  _handleSignInClick = () => {
    // Authenticate using via passport api in the backend
    // Open Twitter login page
    // Upon successful login, a cookie session will be stored in the client
    window.open(config.baseURL + config.baseLOCATION + "/auth/twitter", "_self");
  };

  _handleLogoutClick = () => {
    // Logout using Twitter passport api
    // Set authenticated state to false in the HomePage
    window.open(config.baseURL + config.baseLOCATION + "/auth/logout", "_self");
    sessionStorage.removeItem('userEmail')
    this.props.handleNotAuthenticated();
  };
  _handleNotAuthenticated = () => {
    this.setState({ authenticated: false });
  };
}
