import React, { Component } from 'react'
import { connect } from 'react-redux'
import Axios from 'axios'
import { config } from "../config";


export default OriginalComponent => {
  class MixedComponent extends Component {
    checkAuth() {
      var currenntDate = new Date()
        if (!sessionStorage.getItem('exp') || !sessionStorage.getItem('token') || currenntDate > new Date(sessionStorage.getItem('exp'))) {
          sessionStorage.removeItem('exp')
          sessionStorage.removeItem('userEmail')
          sessionStorage.removeItem('name')
          sessionStorage.removeItem('token')
          window.location.href=config.baseLOCATION
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
