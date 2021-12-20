import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./Header.scss"
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { config } from "../../config"
import { UPDATE_PROFILE, AUTH_SIGN_IN, AUTH_SIGN_OUT, AUTH_ERROR } from '../../redux/reducers/types'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
  UncontrolledPopover, PopoverHeader, PopoverBody
} from 'reactstrap'

import { ExitToApp, ThreeDRotation } from '@material-ui/icons';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Container from '@material-ui/core/Container';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);


const PopoverContent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <PopoverHeader>NOKIA {config.AppName} WEB APPLICATION {config.appVersion}</PopoverHeader>
      <PopoverBody>
        LATEST UPDATES:
      </PopoverBody>
    </>
  );
}


const pages = ['schedule', 'norms', 'add'];
const pagesRight = ['approvals', 'add-users', 'exports', 'normCheck', 'invoiceCheck', 'howTo?', 'tasks'];

export const Header = () => {
  const user = useSelector((state) => ({ auth: state.auth }));
  const [state, setState] = useState([]);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState < null | HTMLElement > (null);
  const [anchorElNav, setAnchorElNav] = React.useState < null | HTMLElement > (null);
  const [anchorElUser, setAnchorElUser] = React.useState < null | HTMLElement > (null);
  const open = Boolean(anchorEl);

  const [pic, setPic] = useState();
  const dispatch = useDispatch();


  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


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
        sessionStorage.setItem('exp', responseJson.user.exp);
        sessionStorage.setItem('userEmail', responseJson.user.email);
        sessionStorage.setItem('userName', responseJson.user.userName);
        sessionStorage.setItem('name', responseJson.user.first_name);
        sessionStorage.setItem('token', responseJson.user.token);
        sessionStorage.setItem('roles', responseJson.user.roles);
        getIcon(responseJson.user.token);
        dispatch({
          type: UPDATE_PROFILE,
          payload: {
            role: responseJson.user.roles,
            userName: responseJson.user.userName,
            name: responseJson.user.first_name,
            email: responseJson.user.email
          },

        })
      }
      )
      .catch(error => {
        setState({
          authenticated: false,
          error: "Failed to authenticate user"
        });
        console.log(error)
      });



  }, [])


  const getIcon = (token) => {
    console.log(token)
    fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
      method: "GET",
      // credentials: "include",
      headers: {
        Authorization: token,
      }
    })
      .then(response => {
        if (response.status === 200) return response;
        throw new Error("failed to authenticate user");
      })
      .then(response => response.blob())
      .then(blob => setPic(URL.createObjectURL(blob)))
      .catch(error => {
        setPic(null);
        // setState({
        //   // authenticated: false,
        //   // error: "Failed to authenticate user"
        // });
        console.log(error)
      });
  }




  const _handleSignInClick = () => {
    // Authenticate using via passport api in the backend
    // Open Twitter login page
    // Upon successful login, a cookie session will be stored in the client
    window.open(config.baseURL + config.baseLOCATION + "/auth/azure", "_self");
  };

  const _handleLogoutClick = () => {
    // Logout using Twitter passport api
    // Set authenticated state to false in the HomePage
    window.open(config.baseURL + config.baseLOCATION + "/auth/logout", "_self");
    sessionStorage.removeItem('exp')
    sessionStorage.removeItem('userName')
    sessionStorage.removeItem('userEmail')
    sessionStorage.removeItem('name')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('roles')
    handleNotAuthenticated();
  };
  const _handleNotAuthenticated = () => {
    setState({ authenticated: false });
  };


  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              <b>NOKIA</b> {config.appversion} {config.AppName}
            </Typography>




            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Link
                  className="nav-link text-white"
                  to={page}
                >
                  {page.toUpperCase()}
                </Link>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {user.auth.role === 'L3' ?
                  pagesRight.map((page) => (
                    <Link
                      className="nav-link text-white"
                      to={page}
                    >
                      {page.toUpperCase()}
                    </Link>
                  ))
                  : null}


                {(state && state.authenticated) ? (
                  <div className="avatar">
                    {console.log(pic)}
                    {/* {pic ? */}
                    <div className='icon'>
                      <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        className="icon"
                        onClick={handleMenu}
                        color="inherit"
                      >
                        <Avatar alt="avatar Sharp"
                          // className={classes.small}
                          src={pic} /> <div className='avatar-name'>{state.user.first_name}</div>
                      </IconButton>
                    </div>
                    {/* : null} */}
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={open}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose}>Profile</MenuItem>
                      <MenuItem onClick={_handleLogoutClick}><span title="log out"><ExitToApp /> Log out</span></MenuItem>
                    </Menu>

                  </div>

                ) : (<div><Button variant="contained" color="primary" onClick={_handleSignInClick}><span title="log in">Login</span></Button></div>)}
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};



export default Header