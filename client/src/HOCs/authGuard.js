import React, { Component } from 'react'
import { connect } from 'react-redux'
import { config } from "../config";


export default OriginalComponent => {
  class MixedComponent extends Component {
    checkAuth() {
        if (!sessionStorage.getItem('token') ) {
          sessionStorage.removeItem('exp')
          sessionStorage.removeItem('userEmail')
          sessionStorage.removeItem('name')
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('roles')
          window.open(config.baseURL + config.baseLOCATION + "/auth/logout", "_self");
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
