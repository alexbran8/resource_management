import React, { Component, useState } from "react";
import { Modal } from "react-bootstrap";
import { useMutation, useQuery, gql } from "@apollo/client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';

const GET_TASKS = gql`
  query ($department: String!) { 
    getTasksQuery (department: $department) {
        Capacity
        Norm_OK
        Norm_NOK_RA
        id
    }
  }
`;

const ADD_TASK = gql`
  mutation ($data: [addTask], $notifications: [notificationInput]) {
    addTask (data:$data, notifications:$notifications){
        success
        message
      }
  }
`;
const EDIT_TASK = gql`
  mutation ($data: [addTask], $data2: [notificationInput]) {
    editTask (data:$data, data2:$data2){
        success
        message
      }
  }
`;


const OperationalModal = (props) => {
  const [tasks, setTasks] = useState()
  const [notifications, setNotifications] = useState()
  const [commentsField, setComments] = useState()
  const [status, setStatus] = useState(true)
  const [selected, setSelected] = useState()
  const { data, loading: get_norms_loading, error: get_norms_error } = useQuery(GET_TASKS, {
    variables: { department: 'RADIO' }, onCompleted: () => {
      console.log(data.getTasksQuery)
      setTasks(data.getTasksQuery)
    }
  });
  const [addTask] = useMutation(ADD_TASK, {
    onCompleted: (data) => {
      setStatus(data.addTask.message);
      alert(data.addTask.message)
    },
    onError: (error) => { console.error("Error creating a post", error); alert("Error creating a post request " + error.message) },
  });
  const [editTask] = useMutation(EDIT_TASK, {
    onCompleted: (data) => {
      setStatus(data.sendNotifications.message);
      alert(data.sendNotifications.message)
    },
    onError: (error) => { console.error("Error creating a post", error); alert("Error creating a post request " + error.message) },
  });

  const _addTask = () => {
    // if (checked.length > 0 || checkedLC.length > 0) {
    console.log('task status', status)
    console.log('comments', commentsField)
    props.event.schedulerData = ''
    let data = {
      task: selected.Capacity, norm: status === true ? parseFloat(selected && selected.Norm_OK) : parseFloat(selected && selected.Norm_NOK_RA),
      comments: commentsField, start: props.event.start, end: props.event.end, nokiaid: props.event.nokiaid, task_status: status === true ? "OK" : "NOK",
    }
    console.log('event', props.event)
    console.log('notifications', notifications)
    addTask({
      variables: {
        data: data,
        notifications: notifications,
      }
    }
    )
    props.updateState(data)
    // }
    // else { alert("please select some tasks...") }
  }


  const _editTask = () => {
    console.log('task edit')
    if (checked.length > 0 || checkedLC.length > 0) {
      editTask({
        variables: {
          data: checked,
          data2: checkedLC
        }
      }
      )
    }
    else { alert("please select some tasks...") }
  }

  return (
    <>
      <Modal
        show={true}
        onHide={
          props.event
            ? () => props.reset()
            : () => props.resetEdit()
        }
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          {props.event ? (
            <Modal.Title>
              <div>ADD OPERATIONAL TASK: {" "}
                {props.event.fullname}{" "}
              </div>
            </Modal.Title>
          ) : (
            <Modal.Title>
              Edit data {props.editEvent.fullname}
            </Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="title">TASK</label>
          <Select
            className="basic-single"
            classNamePrefix="select"
            required={true}
            // defaultValue={}
            // isDisabled={isDisabled}
            // isLoading={isLoading}
            // isClearable={isClearable}
            // isRtl={isRtl}
            onChange={(e) => { console.log(e); setSelected(tasks.filter(item => item.id == e.value)[0]) }}
            isSearchable={true}
            name="color"
            options={tasks && tasks.map(item => { return ({ value: item.id, label: item.Capacity + ' (NOK:' + item.Norm_NOK_RA + ', OK:' + item.Norm_OK + ')' }) })}
          />
          <br />
          <label htmlFor="type">Status</label>
          <br />
          <div className="checkboxContainer">
            <div className="checkbox">
              <label>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={status}
                  onChange={(e) => { e.target.checked === true ? setStatus(true) : setStatus(false); console.log(e.target.checked, status) }}
                />
                OK
              </label>
              <label>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={!status}
                  onChange={(e) => { e.target.checked === false ? setStatus(true) : setStatus(false); console.log(e.target.checked, status) }}
                />
                NOK
              </label>
              <>{selected ? <b>  Norm for selected tasks is: {status === true ? selected && selected.Norm_OK : selected && selected.Norm_NOK_RA} hours</b> : null}</>
            </div>

          </div>
          <br />
          <label htmlFor="type">Comments</label>
          <input
            type="text"
            name="title"
            defaultValue={
              props.editEvent ? props.editEvent.title : ""
            }
            className="form-control"
            onChange={(e) => { setComments(e.target.value) }}
          />
          <br />
          <label htmlFor="type">START</label>
          <input
            type="datetime"
            name="start"
            defaultValue={
              props.event ? props.event.start : props.editEvent.start
            }
            className="form-control"
            onChange={e => {
              if (props.event) {
                props.event.start = e.target.value;
              } else {
                props.editEvent.start = e.target.value;
              }
            }}
          />
          <br />
          <label htmlFor="type">END</label>
          <input
            type="datetime"
            name="end"
            defaultValue={
              props.event ? props.event.end : props.editEvent.end
            }
            className="form-control"
            onChange={e => {
              if (props.event) {
                props.event.end = e.target.value;
              } else {
                props.editEvent.end = e.target.value;
              }
            }}
          />
          <br />
          <label htmlFor="type">NOTIFICATIONS</label>
          <Select
            defaultValue={[]}
            isMulti
            onChange={e => { setNotifications(e) }}
            name="colors"
            options={[{ value: '1', label: '1 hour' }, { value: '12', label: '12 hours' },
            { value: '24', label: '24 hours' },
            { value: '48', label: '48 hours' }]}
            className="basic-multi-select"
            classNamePrefix="select"
          />

          <br />
          {/* <select
          className="form-control"
          name="type"
          defaultValue={
            props.editEvent ? props.editEvent.type : ""
          }
          onChange={e => {
            if (this.props.event) {
              this.props.event.bgColor = e.target.value;
              this.props.event.type =
                e.target.options[e.target.options.selectedIndex].label;
              this.setState({
                type: e.target.options[e.target.options.selectedIndex].label
              });
            } else {
              this.props.editEvent.bgColor = e.target.value;
              this.props.editEvent.type =
                e.target.options[e.target.options.selectedIndex].label;
              this.setState({
                type: e.target.options[e.target.options.selectedIndex].label
              });
            }
          }}
        > */}
          {/* <option value="" disabled hidden>
            Choose here
          </option>
          {props.editEvent ? (
            <option value={props.editEvent.type} disabled hidden>
              {props.editEvent.type}
            </option>
          ) : null}
           {props.types.map(type => {
            return (
              <option
                key={type.type}
                replacement={type.replacement}
                value={type.bgColor}
                label={type.type}
              />
            );
          })}
        </select> */}
          <br />
          {/* {this.renderReplacement(this.state.type)} */}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-danger"
            onClick={
              props.event
                ? () => props.reset()
                : () => props.resetEdit()
            }
          >
            Close
          </button>
          {console.log(props)}
          <button
            className="btn btn-primary"
            onClick={props.event ? _addTask : _editTask
              // : () => _editTask
            }
          >
            {props.event ? <>Save Changes</> : <>Update Changes</>}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

class Operational__Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.editEvent ? this.props.editEvent.type : "",
      start: this.props.editEvent
        ? this.props.editEvent.start
        : this.props.event.start,
      end: this.props.editEvent
        ? this.props.editEvent.end
        : this.props.event.end
    };
  }

  renderReplacement(type) {
    return this.state.type === "Vacation" ||
      this.state.type === "Special Events" ||
      this.state.type === "EH Day Off" ||
      this.state.type === "Blood donation" ||
      this.state.type === "8th March" ||
      this.state.type === "Business Trip" ||
      this.state.type === "Medical Leave" ||
      this.state.type === "Training" ||
      this.state.type === "Unpaid" ? (
      <>
        <label htmlFor="replacement">Replacement required</label>
        <select
          className="form-control"
          name="type"
          id="type"
          defaultValue={
            this.props.editEvent ? this.props.editEvent.replacement : ""
          }
          onChange={e => {
            if (this.props.event) {
              this.props.event.replacement = e.target.value;
            } else {
              this.props.editEvent.replacement = e.target.value;
            }
          }}
        >
          <option value="" disabled hidden>
            Choose here
          </option>
          {this.props.resources.map(user => {
            return (
              <option key={user.id} value={user.name}>
                {user.name}
              </option>
            );
          })}
        </select>
      </>
    ) : this.props.event ? (
      (this.props.event.replacement = "")
    ) : (
      (this.props.editEvent.replacement = "")
    );
  }
  // TODO: add start, end date (will have initial values from newEvent- EditEvent)
  render() {
    console.log(this.props);
    console.log("date", this.state.start.split(" ")[0]);
    return (
      <>
        <Modal
          show={true}
          onHide={
            this.props.event
              ? () => this.props.reset()
              : () => this.props.resetEdit()
          }
        >
          <Modal.Header closeButton>
            {this.props.event ? (
              <Modal.Title>
                <div>OPERATIONAL TASK ADD</div>
                {this.props.event.fullname}{" "}
                {this.props.event.start.split(" ")[0]}-{" "}
                {this.props.event.end.split(" ")[0]}{" "}
              </Modal.Title>
            ) : (
              <Modal.Title>
                Edit data {this.props.editEvent.fullname}
              </Modal.Title>
            )}
          </Modal.Header>
          <Modal.Body>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              defaultValue={
                this.props.editEvent ? this.props.editEvent.title : ""
              }
              className="form-control"
              onChange={e => {
                if (this.props.event) {
                  this.props.event.title = e.target.value;
                } else {
                  this.props.editEvent.title = e.target.value;
                }
              }}
            />
            <br />
            <label htmlFor="type">Type</label>
            <select
              className="form-control"
              name="type"
              defaultValue={
                this.props.editEvent ? this.props.editEvent.type : ""
              }
              onChange={e => {
                if (this.props.event) {
                  this.props.event.bgColor = e.target.value;
                  this.props.event.type =
                    e.target.options[e.target.options.selectedIndex].label;
                  this.setState({
                    type: e.target.options[e.target.options.selectedIndex].label
                  });
                } else {
                  this.props.editEvent.bgColor = e.target.value;
                  this.props.editEvent.type =
                    e.target.options[e.target.options.selectedIndex].label;
                  this.setState({
                    type: e.target.options[e.target.options.selectedIndex].label
                  });
                }
              }}
            >
              <option value="" disabled hidden>
                Choose here
              </option>
              {this.props.editEvent ? (
                <option value={this.props.editEvent.type} disabled hidden>
                  {this.props.editEvent.type}
                </option>
              ) : null}
              {this.props.types.map(type => {
                return (
                  <option
                    key={type.type}
                    replacement={type.replacement}
                    value={type.bgColor}
                    label={type.type}
                  />
                );
              })}
            </select>
            <br />
            {this.renderReplacement(this.state.type)}
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-danger"
              onClick={
                this.props.event
                  ? () => this.props.reset()
                  : () => this.props.resetEdit()
              }
            >
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={
                this.props.event
                  ? () => this.props.sendData(this.props.event)
                  : () => this.props.updateData(this.props.editEvent)
              }
            >
              {this.props.event ? <>Save Changes</> : <>Update Changes</>}
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default OperationalModal;
