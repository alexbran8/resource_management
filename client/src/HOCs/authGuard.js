import React, { Component } from 'react'
import { connect } from 'react-redux'
import Axios from 'axios'
import { config } from "../config";


export default OriginalComponent => {
  class MixedComponent extends Component {
    checkAuth() {
      // if (!this.props.isAuth && !this.props.jwtToken) {
      // console.log(`**(Nav) Checking local storage...`)
        if (!sessionStorage.getItem('userEmail')) {
          const user = JSON.parse(sessionStorage.getItem('user'))
          console.log(`**(Nav) User found in local storage...`)
          this.props.history.push(config.baseLOCATION)
        } 
      // }
      
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
