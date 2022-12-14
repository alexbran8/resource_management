import Axios from 'axios'
// import { AUTH_SIGN_UP, AUTH_SIGN_IN, AUTH_SIGN_OUT, AUTH_ERROR } from './types'
import { config } from '../../config'
// var jwtDecode = require('jwt-decode')
// import * as jwtDecode from 'jwt-decode';
import jwtDecode from 'jwt-decode'

export const SignUp = data => {
  return dispatch => {
    try {
      console.log('data',data)
      Axios.post(`${config.baseURL + config.baseLOCATION}/users/signup`, data, { withCredentials: true })
        .then(function (response) {
          console.log('res', response.data.message)
          alert(response.data.message)
        })
        .catch(err => {
          console.log(err.response.data.message);
          alert(err.response.data.message)
        })
      // const decode = jwtDecode(res.data.token)
      // dispatch({
      //   type: AUTH_SIGN_UP,
      //   payload: res.data.token,
      //   payload_role: decode.role,
      //   payload_email: data.email,
      //   payload_name: decode.name,
      //   payload_nokiaid: decode.sub
      // })
      // sessionStorage.setItem('token', res.data.token)
      // sessionStorage.setItem('permisiuni', JSON.stringify(decode.role))
      // sessionStorage.setItem('email', data.email)
      // sessionStorage.setItem('name', decode.name)
      // sessionStorage.setItem('nokiaid', decode.sub)
    } catch (error) {
      if (error.response.status === 400) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response.data.details[0].message
        })
      } else {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response.data
        })
      }
    }
  }
}

