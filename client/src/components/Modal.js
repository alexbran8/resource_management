import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
class CustomModal extends Component {
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
    console.log(this.state);
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
              {/* {this.props.types.map(type => {
                return (
                  <option
                    key={type.type}
                    replacement={type.replacement}
                    value={type.bgColor}
                    label={type.type}
                  />
                );
              })} */}
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

export default CustomModal;
