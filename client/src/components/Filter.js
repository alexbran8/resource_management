import React, { useState, useEffect } from 'react';
import Axios from "axios";
import { config } from '../config';
var moment = require("moment");

const Filter = () => {
    const [events, setEvents] = useState()
    const [teams, setTeams] = useState()
    const [LM, setLM] = useState()
    const [TPM, setTPM] = useState()
    const [employeers, setEmployeers] = useState()
    const [resources, setResources] = useState()
    let params = { 'admin': true, 'operational': false }
    const [state, setState] = useState({ admin: true, operational: false });
    let initData = {
        line_manager: "",
        team: "",
        coordinator: "",
        employeers: "",
        resources: "",
        admin: true,
        operational: false,
      }

    useEffect(() => {
        init()
    }
        ,[]
    )
    

  const onChangeCheckBox = (fieldName, e) => {
      setState(prevState => ({ ...prevState, [fieldName]: !state[fieldName] }));
      init();
}


    const  init = async (initData) => {
        const events = await Axios.post(`${config.baseURL + config.baseLOCATION}/schedule/get`, params, {withCredentials: true})
        console.log("events", events);
        if (events) {
          const fmtEvents = events.data.schedule.reduce((prev, entry) => {
            prev.push({
              id: entry.id,
              start: moment(entry.start).format("YYYY-MM-DD h:mm:ss"),
              end: moment(entry.end).format("YYYY-MM-DD h:mm:ss"),
              resourceId: entry.nokiaid,
              title: entry.title,
              bgColor: entry.bgColor,
              type: entry.type,
              replacement: entry.replacement,
            });
            return prev;
          }, []);
          setEvents(fmtEvents)
        }


        
        const users = await Axios.get(`${config.baseURL + config.baseLOCATION}/usersPrivate/get`, {withCredentials: true})
        console.log("users", users);
        if (users) {
          const fmtUsers = users.data.users.reduce((prev, entry) => {
            prev.push({
              id: entry.nokiaid,
              name: `${entry.lastname}, ${entry.firstname}`,
            });
            return prev;
          }, []);

          setTeams(users.data.team)
          setLM(users.data.line_manager[0])
          setTPM(users.data.tpm[0])
          setEmployeers(users.data.employeers[0])
          setResources(fmtUsers)

        }
      }
    

    return (<div>
         <>
            <form
              className="filter text-center row"
              onSubmit={(e) => {
                e.preventDefault();
                // this.filter(this.state.filter);
              }}
            >
              <select
                className="form-control p-2 m-3 col"
                defaultValue=""
                onChange={(e) => {
                //   const lineObj = { ...this.state.filter };
                //   lineObj.line_manager = e.target.value;
                //   this.setState({ filter: lineObj });
                }}
              >
                <option value="">Line manager</option>
                {LM && LM.length > 0
                  ? LM.map((main) => {
                      const name = `${main.line_manager_lastname} ${main.line_manager_firstname}`;
                      return (
                        <option key={name} value={main.line_manager_firstname}>
                          {name}
                        </option>
                      );
                    })
                  : null}
              </select>
              <select
                className="form-control p-2 m-3 col"
                defaultValue=""
                onChange={(e) => {
                //   const teamObj = { ...this.state.filter };
                //   teamObj.team = e.target.value;
                //   this.setState({ filter: teamObj });
                }}
              >
                <option value="">Team</option>
                {teams && teams.length > 0
                  ? teams.sort().map((main) => {
                      return (
                        <option key={main.DISTINCT} value={main.DISTINCT}>
                          {main.DISTINCT}
                        </option>
                      );
                    })
                  : null}
              </select>
              <select
                className="form-control p-2 m-3 col"
                defaultValue=""
                onChange={(e) => {
                //   const coordObj = { ...this.state.filter };
                //   coordObj.coordinator = e.target.value;
                //   this.setState({ filter: coordObj });
                }}
              >
                <option value="">Coordinator</option>
                {TPM && TPM.length > 0
                  ? TPM.map((main) => {
                      const name = `${main.tpm_firstname} ${main.tpm_lastname}`;
                      return (
                        <option key={name} value={main.tpm_lastname}>
                          {name}
                        </option>
                      );
                    })
                  : null}
              </select>

              <select
                className="form-control p-2 m-3 col"
                defaultValue=""
                onChange={(e) => {
                //   const empObj = { ...this.state.filter };
                //   empObj.employeers = e.target.value;
                //   this.setState({ filter: empObj });
                }}
              >
                <option value="">Employeer</option>
                {employeers && employeers.length > 0
                  ? employeers.map((main) => {
                      const name = `${main.employeer}`;
                      return (
                        <option key={name} value={main.employeer}>
                          {name}
                        </option>
                      );
                    })
                  : null}
              </select>

              <select
                className="form-control p-2 m-3 col"
                defaultValue=""
                onChange={(e) => {
                //   const resObj = { ...this.state.filter };
                //   resObj.resources = e.target.value;
                //   this.setState({ filter: resObj });
                }}
              >
                <option value="">Resource</option>
                {resources && resources.length > 0
                  ? resources.map((main) => {
                      const name = `${main.name}`;
                      return (
                        <option key={name} value={main.name}>
                          {name}
                        </option>
                      );
                    })
                  : null}
              </select>
              <div className="checkboxContainer">
                <div className="checkbox">
                  <label>
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={state.admin}
                      onChange={(e) => onChangeCheckBox("admin", e)}
                    />
                administrative
              </label>
                  <label>
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={state.operational}
                      onChange={(e) => onChangeCheckBox("operational", e)}
                    />
                operational
              </label>
                </div>
              </div>


              <button
                className="btn btn-success m-3"
                onClick={(e) => {
                  e.preventDefault();
                //   this.filter(this.state.filter);
                }}
              >
                Filter
              </button>
              <button
                className="btn btn-warning m-3"
                onClick={(e) => {
                  e.preventDefault();
                  this.filter({
                    team: "",
                    line_manager: "",
                    coordinator: "",
                    employeers: "",
                    resources: "",
                  });
                }}
              >
                Clear filter
              </button>
            </form>
            {/* {this.state.resources.length > 0 ? (
              this.getSchedule()
            ) : (
              <div className="noApprove text-center">
                <h1>No users found.</h1>
              </div>
            )} */}
          </>

    </div>)

}

export default Filter