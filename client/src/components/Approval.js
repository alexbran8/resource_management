import React, { Component } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { config } from "../config";;

import * as actions from "../actions";

var moment = require("moment");

class Approval extends Component {
  constructor(props) {
    super(props);
    this.state = { events: [], ids: [] };
  }

  async componentDidMount() {
    const events = await Axios.get(`${ config.baseURL + config.baseLOCATION }/schedule/get/status`,{withCredentials: true});
    this.setState({ events: events.data.data });
    console.log("events to approve", events);
  }

  createArr(id) {
    if (this.state.ids.includes(id)) {
      const index = this.state.ids.indexOf(id);
      this.state.ids.splice(index, 1);
    } else {
      this.setState({
        ids: this.state.ids.concat(id),
      });
    }
  }

  renderEvents(data) {
   
    if (data.length > 0) {
      var x = data.map((e) => {
        return (
          <div className="eventBar mt-3 p-2 shadow-sm row" key={e.id}>
            <strong>Name:</strong>
            <p className="col">{e.createdBy}</p>
            <strong>Title:</strong>
            <p className="col">{e.title}</p>
            {e.replacement !== null && e.replacement !== "" ? (
              <>
                <strong>Replacement:</strong>
                <p className="col">{e.replacement}</p>
              </>
            ) : null}
            <strong>Type:</strong>
            <p className="col">{e.type}</p>
            <strong>Start:</strong>
            <p className="col">
              {moment(e.start).format("YYYY-MM-DD h:mm:ss")}
            </p>
            <strong>End:</strong>
            <p className="col">{moment(e.end).format("YYYY-MM-DD h:mm:ss")}</p>
            <strong>Status:</strong>
            {e.status === "L1" ? (
              <p className="col">Need TPM approval</p>
            ) : (
              <p className="col">Need LM approval</p>
            )}
            <input
              className="m-1"
              type="checkbox"
              onChange={() => this.createArr(e.id)}
            />
          </div>
        );
      });
      return x;
    }
  }

  async approveUpdate() {
    const data = {
      ids: this.state.ids,
      status: this.props.role,
      events: this.state.events,
    };

    console.log(this);

    const response = await Axios.post(`${ config.baseURL + config.baseLOCATION }/schedule/update/`, data);
    if (!response) {
      alert("failed");
    }
    window.location.reload();
  }

  async declineUpdate() {
    const ids = this.state.ids;
    const events = this.state.events;
    if (ids.length > 0) {
      const response = await Axios.delete(
        `${ config.baseURL + config.baseLOCATION }/schedule/delete/${ids}`,
        events
      );
      if (!response) {
        alert("failed");
      }
    }

    window.location.reload();
  }

  render() {
    return (
      <div>
      {(this.props.role === "L3" || this.props.role === "L2") &&
        this.state.events.length > 0 ? (
          <>
            <div className="text-center m-4 row">
              <div className="col">
                <button
                  onClick={() => this.approveUpdate()}
                  className="btn btn-success"
                >
                  Approve selected
                </button>
              </div>
              <div className="col">
                <button
                  onClick={() => this.declineUpdate()}
                  className="btn btn-danger"
                >
                  Decline selected
                </button>
              </div>
            </div>
            {this.renderEvents(this.state.events)}
          </>
        ) : (
          <div className="noApprove text-center">
             <h1>No requests to approve, yet...</h1>
             {console.log(this.props.role)}
          </div>
        )}
      </div>
    );
  }
}
function MapStateToProps(state) {
  return {
    role: state.auth.role,
  };
}

export default connect(MapStateToProps, actions)(Approval);
