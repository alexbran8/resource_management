import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Axios from 'axios'
import { config } from '../config'

import { useSelector } from "react-redux";

const DetailModal = (props) => {
const [users, setUsers] = useState()
const user = useSelector((state) => ({ auth: state.auth }));
const [edit, setEdit] = useState(false)
const [status, setStatus]= useState()


useEffect(() => {
  Axios.get(`${ config.baseURL + config.baseLOCATION }/usersPrivate/get/${props.id}`, {withCredentials: true})
  .then(res => {
    setUsers(res.data.users[0]);
  }
  )
  .catch(error => {
    console.log(error)
  })
},[])

  const sendChanges = (data) => { 
  Axios.post(`${ config.baseURL + config.baseLOCATION }/usersPrivate/edit`, data, {withCredentials: true})
  .then(res => { res.status === 200 ? setStatus('update successfull!'):setStatus('Error on update');editStatus()})
  .catch(error => {console.log(error);setStatus('Error on update')})
  
  
  }

  const deleteAccount = (data) => {
    const deleteData = Axios.delete(`${ config.baseURL + config.baseLOCATION }/usersPrivate/delete/${data}`,{withCredentials:true})
    if (!deleteData) {
      alert('failed')
    }
    window.location.reload()
  }



const renderRows = (title, variable) => {
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

    const editStatus = () => { 
      console.log('xxxx')
       setEdit (!edit)
    }
  const  renderEditRows = (title, variable) => {
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
              variable === 'password' ? '' : users[variable]
            }
            onChange={e => {
              const obj = { ...users }
              console.log(obj)
              obj[variable] = e.target.value
              {console.log(users)}
              setUsers(obj)
            }}
          />
        </div>
      )
    }

  return (  users ? (
       <Modal show={true} onHide={() => props.resetSlot()}>
         <Modal.Header closeButton>
           <Modal.Title>Detailed data</Modal.Title>
         </Modal.Header>
       <Modal.Body>
         <div>{status}</div>
         {console.log(props)}
          {!edit ? (
            <>
              {[
                renderRows('Short ID', users.shortid),
                renderRows('Nokia ID', users.nokiaid),
                renderRows('UPI', users.upi),
                renderRows('City', users.city),
                renderRows('Employeer', users.employeer),
                renderRows('Main Team', users.main_team),
                renderRows('Second Team', users.second_team),
                renderRows('Thrid team', users.third_team),
                renderRows('Activity', users.activity),
                renderRows('UPALU', users.upalu),
                renderRows('BANDEAU', users.bandeau),
                renderRows('NEW_ONNET', users.new_onnet),
                renderRows('NEW TEL FR', users.new_tel_fr)
              ]}
            </>
          ) : (
              <>
                {[
                  renderEditRows('Short ID', 'shortid'),
                  renderEditRows('UPI', 'upi'),
                  renderEditRows('Nokia ID', 'nokiaid'),
                  <div key={'city'} className="input-group mt-2">
                  <div className="input-group-prepend">
                    <span className="customSpan input-group-text">
                      <b>City</b>
                    </span>
                  </div>
                  <select
                    className="form-control"
                    value={users['city']
                    }
                    onChange={e => {
                      const obj = { ...users }
                      obj['city'] = e.target.value
                      setUsers(obj)
                    }}
                  >
                    <option>TM</option>
                    <option>BU</option>
                    </select>
                </div>,
                  // renderEditRows('Employeer', 'employeer'),
                  <div key={'employeer'} className="input-group mt-2">
                  <div className="input-group-prepend">
                    <span className="customSpan input-group-text">
                      <b>Employeer</b>
                    </span>
                  </div>
                  <select
                    className="form-control"
                    value={users['employeer']
                    }
                    onChange={e => {
                      const obj = { ...users }
                      obj['employeer'] = e.target.value
                      setUsers(obj)
                    }}
                  >
                    <option>Deltatel</option>
                    <option>NOKIA</option>
                    <option>SII</option>
                    </select>
                </div>,
                  renderEditRows('Email', 'email'),
                  <div key={'main_team'} className="input-group mt-2">
                  <div className="input-group-prepend">
                    <span className="customSpan input-group-text">
                      <b>Main Team</b>
                    </span>
                  </div>
                  <select
                    className="form-control"
                    value={users['main_team']
                    }
                    onChange={e => {
                      console.log(e.target.value)
                      const obj = { ...users }
                      obj['main_team'] = e.target.value
                      setUsers(obj)
                    }}
                  >
                    <option>AMO</option>
                    <option>Auto</option>
                    <option>Build</option>
                    <option>CDI</option>
                    <option>Management</option>
                    <option>Radio CDP</option>
                    <option>Radio LDP</option>
                    <option>SAO</option>
                    <option>TAC</option>
                    <option>TFT</option>
                    <option>Prod XP</option>
                    </select>
                </div>,
                  renderEditRows('Second Team', 'second_team'),
                  renderEditRows('Third Team', 'third_team'),
                  <div key={'activity'} className="input-group mt-2">
                  <div className="input-group-prepend">
                  <span className="customSpan input-group-text">
                      <b>Activity</b>
                    </span>
                  </div>
                  <select
                    className="form-control"
                    value={users['activity']
                    }
                    onChange={e => {
                      const obj = { ...users }
                      obj['activity'] = e.target.value
                      setUsers(obj)
                    }}
                  >
                    <option>CRZ</option>
                    <option>CDI</option>
                    <option>CDR</option>
                    <option>BMA</option>
                    <option>Check KPI/Coupure - Bytel Project</option>
                    <option>SAO</option>
                    <option>TAC</option>
                    <option>AMO</option>
                    <option>OTHER</option>
                    </select>
                </div>,
                  renderEditRows('UPALU', 'upalu'),
                  renderEditRows('BANDEAU', 'bandeau'),
                  renderEditRows('NEW_ONNET', 'new_onnet'),
                  renderEditRows('MARCA', 'marca'),
                  renderEditRows('NEW TEL FR', 'new_tel_fr'),
                  renderEditRows('Location Area', 'location_area'),
                  renderEditRows('Location No.', 'location_number'),
                  <div key={'activity'} className="input-group mt-2">
                  <div className="input-group-prepend">
                  <span className="customSpan input-group-text">
                      <b>TPM</b>
                    </span>
                  </div>
                  <select
                    className="form-control"
                    value={users['tpm']
                    }
                    onChange={e => {
                      const obj = { ...users }
                      obj['tpm'] = e.target.value
                      setUsers(obj)
                    }}
                  >
                    <option value={69063787}>Alexandru, RADULESCU</option>
                    <option value={69141307}>Diana, BULZAN</option>
                    <option value={69087716}>Mihai, PETRILA</option>
                    <option value={69069043}>Adriana, SCOABA</option>
                    <option value={69183560}>Andrada, STEFAN</option>
                    <option value={69069805}>CHEROIU, Ionela Florentina</option>
                    <option value={69063297}>Stelian, ANGHEL</option>
                    <option value={69129233}>Lucian Eduard, IONESCU</option>
                    <option value={69107758}>Eugen, GHEGU</option>
                    <option value={69085848}>Georgiana Emilia, JURESCU</option>
                    <option value={69035905}>Florin, ILCA</option>
                    <option value={69038202}>Cecilia, CRISAN</option>
                    <option value={69158281}>Ana Maria, LUPULEASA</option>
                    <option value={69179346}>Anamaria, POPESCU</option>
                    <option value={69087700}>Dragos, PASARICA</option>
                    <option value={69036287}>Ramona Vasilica, SPERLEA</option>
                    </select>
                </div>,
                  renderEditRows('LM First Name.', 'line_manager_firstname'),
                  renderEditRows('LM Last Name', 'line_manager_lastname'),
                ]}
              </>
            )}
        </Modal.Body> 
      <Modal.Footer>
          <button
            className="btn btn-danger float-right"
            onClick={() => props.resetSlot()}
          >
            Close
          </button>
          {user.auth.role === 'L3' || user.auth.role === 'L2' ? (
            <>
              <button
                className={
                  'float-right ' +
                  (edit ? 'btn btn-warning' : 'btn btn-primary mr-1')
                }
                onClick={() => editStatus()}
              >
                {edit ? 'Close edit' : 'Edit user'}
              </button>
              {edit ? (
                <>
                  <button
                    className="btn btn-success"
                    onClick={() => sendChanges(users)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteAccount(users.nokiaid)}
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
  )
}




export default DetailModal
