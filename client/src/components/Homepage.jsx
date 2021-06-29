import Header from "./Header.jsx";
import PropTypes from "prop-types";
import React, { Component } from "react";
import {config} from "../config"


export default class HomePage extends Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      profileImageUrl: PropTypes.string,
      twitterId: PropTypes.string,
      screenName: PropTypes.string,
      _id: PropTypes.string
    })
  };
    state = {
      user: {},
      error: null,
      authenticated: false
    };


  

  render() {
    const { authenticated, user } = this.state;
    return (
      <div>
        <div>
          {!authenticated ? (
            <h1>Welcome!</h1>
          ) : (
            <div>
              {console.log(this.state.user)}
              <h1>You have login succcessfully!</h1>
              <h2>Welcome {this.state.user.email}!</h2>
            </div>
          )}
        </div>
      </div>
    );
  }


}
