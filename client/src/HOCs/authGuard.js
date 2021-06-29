import React, { Component } from 'react'
import { connect } from 'react-redux'
import Axios from 'axios'
import { config } from "../config";


export default OriginalComponent => {
  class MixedComponent extends Component {
    checkAuth() {
      if (!this.props.isAuth && !this.props.jwtToken) {
      console.log(`**(Nav) Checking local storage...`)
        if (sessionStorage.getItem('userEmail')) {
          const user = JSON.parse(sessionStorage.getItem('user'))
          console.log(`**(Nav) User found in local storage...`)
          this.setState({
            firstName: user.firstName || user.email,
            lastName: user.lastName,
            loginName: user.email,
            isAuth: true
          })
          this.props.history.push(config.baseLOCATION)
        } else {
          console.log(
            `**(Nav) User not found in local storage. Checking if user is logged in...`
          )
          this.props.history.push(config.baseLOCATION)
          // fetch( config.baseURL + config.baseLOCATION + "/auth/login/success/", {
          //   method: "GET",
          //   credentials: "include",
          //   headers: {
          //     Accept: "application/json",
          //     "Content-Type": "application/json",
          //     "Access-Control-Allow-Credentials": true
          //   }
          // })
          //   .then(response => {
          //     if (response.status === 200) return response.json();
          //     throw new Error("failed to authenticate user");
          //   })
          //   .then(responseJson => {
          //     this.setState({
          //       authenticated: true,
          //       user: responseJson.user
          //     });
          //     // save to localstorage and redux
          //   })
          //   .catch(error => {
          //     this.setState({
          //       authenticated: false,
          //       error: "Failed to authenticate user"
          //     });
          //   });
                  }
      }
      
    }
    componentDidMount() {
      this.checkAuth()
    }

    componentDidUpdate() {
      this.checkAuth()
    }

    render() {
      return <OriginalComponent {...this.props} />
    }
  }

  function MapStateToProps(state) {
    return {
      isAuth: state.auth.isAuthenticated,
      // jwtToken: state.auth.token
    }
  }
  return connect(MapStateToProps)(MixedComponent)
}
