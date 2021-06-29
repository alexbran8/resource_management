import React, { Component } from 'react'
import { connect } from 'react-redux'
import Axios from 'axios'
import * as actions from '../actions'
import { config } from '../config'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

var moment = require('moment')

class Request extends Component {
  constructor(props) {
    super(props)
    this.state = {
      types: undefined,
      title: '',
      start: new Date(),
      end: new Date(),
      type: '',
      bgColor: '',
      status: '',
      nokiaid: '',
      replacement: ''
    }
  }
  async componentDidMount() {
    const users = await Axios.get(`${ config.baseURL + config.baseLOCATION }/usersPrivate/get`)
    if (users) {
      const fmtUsers = users.data.users.reduce((prev, entry) => {
        prev.push({
          id: entry.nokiaid,
          name: `${entry.firstname} ${entry.lastname}`
        })
        return prev
      }, [])
      this.setState({
        resources: fmtUsers
      })
    }
    const types = await Axios.get(`${ config.baseURL + config.baseLOCATION }/types`)
    if (types) this.setState({ types: types.data.data })
  }

 async onSubmit(data) {
    if (
      (this.state.type === 'Vacation' ||
        this.state.type === 'Special Events' ||
        this.state.type === 'EH Day Off' ||
        this.state.type === 'Blood donation' ||
        this.state.type === '8th March' ||
        this.state.type === 'Business Trip' ||
        this.state.type === 'Medical Leave' ||
        this.state.type === 'Unpaid') &&
      this.state.replacement === ''
    ) {
      return alert('Replacement required!')
    }
    if (data.title === undefined || data.title === '' || data.title === null) {
      return alert('Title is empty')
    }
    if (data.start === undefined || data.start === '' || data.start === null) {
      return alert('Start is empty')
    }
    if (data.end === undefined || data.end === '' || data.end === null) {
      return alert('End is empty')
    }
    if (data.type === undefined || data.type === '' || data.type === null) {
      return alert('Type is empty')
    }
    if (this.props.role === 'L3') {
      data.status = 'L3'
    } else if (this.props.role === 'L2') {
      data.status = 'L2'
    } else {
      data.status = 'L1'
    }

    data.start = moment(data.start).format('YYYY-MM-DD h:mm:ss')
    data.end = moment(data.end).format('YYYY-MM-DD h:mm:ss')
    data.createdBy = this.props.name

  

    await Axios.post(`${ config.baseURL + config.baseLOCATION }/schedule/add`, data)
    .then(res =>console.log(res)
      )
    
    // if (!response) {
    //   alert('failed')
    // }
    // this.props.history.push('/schedule')
  }

  render() {
    return (
      <div>
        <form
          className="request col-lg-6 col-md-10"
          onSubmit={() => this.onSubmit(this.state)}
        >
            {this.state.resources && this.state.resources !== undefined ? (
                <>
                  <label htmlFor="nokiaid">Resource</label>
                  <select
                    className="form-control"
                    name="type"
                    id="type"
                    defaultValue=""
                    onChange={e => {this.setState({ nokiaid: e.target.value })}}
                  >
                    <option value="x" disabled hidden>
                      Choose here
                  </option>
                    {this.state.resources.map(user => {
                      return (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      )
                    })}
                  </select>
                </>               
              
          ) : null}
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            onChange={e => {
              this.setState({ title: e.target.value })
            }}
          />
          <div className="row mt-3 mb-3">
            <div className="col">
              <label htmlFor="start">Start</label>
              <DatePicker
                className="form-control"
                name="start"
                id="start"
                selected={this.state.start}
                onChange={e => {
                  this.setState({
                    start: e
                  })
                }}
                minDate={new Date()}
              />
            </div>
            <div className="col">
              <label htmlFor="end">End</label>
              <DatePicker
                className="form-control"
                name="end"
                id="end"
                selected={this.state.end}
                onChange={e => {
                  this.setState({ end: e })
                }}
                minDate={this.state.start}
              />
            </div>
          </div>
          <label htmlFor="type">Type</label>
          <select
            className="form-control"
            name="type"
            id="type"
            defaultValue=""
            onChange={e =>
              this.setState({
                bgColor: e.target.value,
                type: e.target.options[e.target.options.selectedIndex].label
              })
            }
          >
            <option value="" disabled hidden>
              Choose here
            </option>
            {this.state.types !== undefined
              ? this.state.types.map(type => {
                return (
                  <option
                    key={type.type}
                    // replacement={type.replacement}
                    value={type.bgColor}
                    label={type.type}
                  />
                )
              })
              : null}
          </select>
          <br />
          {this.state.resources ? (
            this.state.type === 'Vacation' ||
              this.state.type === 'Special Events' ||
              this.state.type === 'EH Day Off' ||
              this.state.type === 'Blood donation' ||
              this.state.type === '8th March' ||
              this.state.type === 'Business Trip' ||
              this.state.type === 'Medical Leave' ||
              this.state.type === 'Unpaid' ? (
                <>
                  <label htmlFor="replacement">Replacement required</label>
                  <select
                    className="form-control"
                    name="type"
                    id="type"
                    defaultValue=""
                    onChange={e => this.setState({ replacement: e.target.value })}
                  >
                    <option value="" disabled hidden>
                      Choose here
                  </option>
                    {this.state.resources.map(user => {
                      return (
                        <option key={user.id} value={user.name}>
                          {user.name}
                        </option>
                      )
                    })}
                  </select>
                </>
              ) : (
                (this.state.replacement = '')
              )
          ) : null}
          <div className="w-100 text-center">
            <button className="btn btn-primary mt-5 p-3" type="submit">
              Request event
            </button>
          </div>
        </form>
      </div>
    )
  }
}
function MapStateToProps(state) {
  return {
    role: state.auth.role,
    email: state.auth.userName,
    isAuth: state.auth.isAuthenticated,
    name: state.auth.name
  }
}

export default connect(
  MapStateToProps,
  actions
)(Request)
