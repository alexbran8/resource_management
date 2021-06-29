import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import Axios from 'axios'
import { config } from '../config'

class DetailModal extends Component {
  constructor(props) {
    super(props)
    this.state = { info: undefined, edit: false, checkPassword: '' }
  }
  async componentDidMount() {
    const info = await Axios.get(`${ config.baseURL + config.baseLOCATION }/usersPrivate/get/${this.props.id}`)
    if (!info) {
      alert('failed')
    }
    this.setState({
      info: info.data.users[0],
      checkPassword: info.data.users[0].password
    })
  }

  editStatus() {
    this.setState({ edit: !this.state.edit })
  }
  renderRows(title, variable) {
    return (
      <div key={`${title}`} className="input-group mt-2">
        <div className="input-group-prepend">
          <span className="customSpan input-group-text">
            <b>{`${title}`}</b>
          </span>
        </div>
        <div className="form-control">{variable}</div>
      </div>
    )
  }
  renderEditRows(title, variable) {
    return (
      <div key={title} className="input-group mt-2">
        <div className="input-group-prepend">
          <span className="customSpan input-group-text">
            <b>{`${title}`}</b>
          </span>
        </div>
        <input
          className="form-control"
          defaultValue={
            variable === 'password' ? '' : this.state.info[variable]
          }
          onChange={e => {
            const obj = { ...this.state.info }
            obj[variable] = e.target.value
            this.setState({ info: obj })
          }}
        />
      </div>
    )
  }

  async sendChanges(data) {
    data.checkPassword = this.state.checkPassword
    const sendData = Axios.post(`${ config.baseURL + config.baseLOCATION }/usersPrivate/edit`, data)
    if (!sendData) {
      alert('failed')
    }
    window.location.reload()
  }

  async deleteAccount(data) {
    const deleteData = Axios.delete(`${ config.baseURL + config.baseLOCATION }/usersPrivate/delete/${data}`)
    if (!deleteData) {
      alert('failed')
    }
    window.location.reload()
  }

  render() {
    const info = this.state.info
    return this.state.info ? (
      <Modal show={true} onHide={() => this.props.resetSlot()}>
        <Modal.Header closeButton>
          <Modal.Title>Detailed data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!this.state.edit ? (
            <>
              {[
                this.renderRows('Short ID', info.shortid),
                this.renderRows('Nokia ID', info.nokiaid),
                this.renderRows('UPI', info.upi),
                this.renderRows('City', info.city),
                this.renderRows('Employeer', info.employeer),
                this.renderRows('Main Team', info.main_team),
                this.renderRows('Second Team', info.second_team),
                this.renderRows('Thrid team', info.third_team),
                this.renderRows('Activity', info.activity),
                this.renderRows('UPALU', info.upalu),
                this.renderRows('BANDEAU', info.bandeau),
                this.renderRows('NEW_ONNET', info.new_onnet),
                this.renderRows('NEW TEL FR', info.new_tel_fr)
              ]}
            </>
          ) : (
              <>
                {[
                  this.renderEditRows('Short ID', 'shortid'),
                  this.renderEditRows('UPI', 'upi'),
                  this.renderEditRows('Nokia ID', 'nokiaid'),
                  this.renderEditRows('City', 'city'),
                  this.renderEditRows('Employeer', 'employeer'),
                  this.renderEditRows('Email', 'email'),
                  this.renderEditRows('Level', 'level'),
                  this.renderEditRows('Main Team', 'main_team'),
                  this.renderEditRows('Second Team', 'second_team'),
                  this.renderEditRows('Third Team', 'third_team'),
                  this.renderEditRows('Activity', 'activity'),
                  this.renderEditRows('UPALU', 'upalu'),
                  this.renderEditRows('BANDEAU', 'bandeau'),
                  this.renderEditRows('NEW_ONNET', 'new_onnet'),
                  this.renderEditRows('MARCA', 'marca'),
                  this.renderEditRows('NEW TEL FR', 'new_tel_fr'),
                  this.renderEditRows('Location Area', 'location_area'),
                  this.renderEditRows('Location No.', 'location_number'),
                  this.renderEditRows('TPM First Name', 'tpm_firstname'),
                  this.renderEditRows('TPM Last Name', 'tpm_lastname'),
                  this.renderEditRows('LM First Name.', 'line_manager_firstname'),
                  this.renderEditRows('LM Last Name', 'line_manager_lastname'),
                  this.props.level
                    ? this.renderEditRows('New password', 'password')
                    : null
                ]}
              </>
            )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-danger float-right"
            onClick={() => this.props.resetSlot()}
          >
            Close
          </button>
          {this.props.level === 'L3' ? (
            <>
              <button
                className={
                  'float-right ' +
                  (this.state.edit ? 'btn btn-warning' : 'btn btn-primary mr-1')
                }
                onClick={() => this.editStatus()}
              >
                {this.state.edit ? 'Close edit' : 'Edit user'}
              </button>
              {this.state.edit ? (
                <>
                  <button
                    className="btn btn-success"
                    onClick={() => this.sendChanges(this.state.info)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => this.deleteAccount(this.state.info.nokiaid)}
                  >
                    Delete user
                  </button>
                </>
              ) : null}
            </>
          ) : null}
        </Modal.Footer>
      </Modal>
    ) : null
  }
}

export default DetailModal
