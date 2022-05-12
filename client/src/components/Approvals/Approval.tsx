import React, { useEffect, useRef, useState, createRef } from "react";
import Axios from "axios";
import { config } from "../../config";
import { useSelector } from "react-redux";
var moment = require("moment");

import "./Approval.scss"

export const Approvals = () => {
  const user = useSelector((state) => ({ auth: state.auth }));
  const [state, setState] = useState({ events: [], ids: [], monthList: [] })
  const [events, setEvents] = useState([])
  const [elementsRef, setElementsRef] = useState([])
  const updatedElementsRef = useRef(Object.keys(events).map(() => createRef()));

  const [ids, setIds] = useState([])
  const inputRef = useRef([]);

  useEffect(async () => {

    const events = await Axios.get(`${config.baseURL + config.baseLOCATION}/schedule/get/status`, { withCredentials: true });
    let sortedEvents = events.data.data.sort(function (a, b) {
      var key1 = a.start;
      var key2 = b.start;

      if (key1 < key2) {
        return -1;
      } else if (key1 == key2) {
        return 0;
      } else {
        return 1;
      }
    });

    let newSortedEvents = sortedEvents.map(obj => ({ ...obj, month: new Date(obj.start).getMonth()+1 + ' - ' + new Date(obj.start).getFullYear() }))


    var groups = ['month']
    var grouped = {}
    newSortedEvents.forEach(function (a) {
      groups.reduce(function (o, g, i) {                            // take existing object,
        o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {}); // or generate new obj, or
        return o[a[g]];                                         // at last, then an array
      }, grouped).push(a);
    });

    setEvents(grouped);

    // getMonths
    let allMonths = []
    newSortedEvents.forEach(item => allMonths.push(item.month))
    let uniqueMonths = Array.from(new Set(allMonths))
    setState({ monthList: uniqueMonths });

    setElementsRef(updatedElementsRef)

  }, [])

  const scrollEffect = (targetRef) => {
    //  console.log(targetRef)
    //  console.log(elementsRef.ref = targetRef )
    //  targetRef.current.focus()
    const next = inputRef.current[targetRef];
    if (next) {
      // next.scrollIntoView(true);
      next.scrollIntoView({
        behavior: 'smooth',
        // block: 's ref={el => inputRef.current[e] = el} ',
      });
      next.focus()
      //   next.hover();
    }
    // targetRef.current.scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'start',
    // });
  }

  const createArr = (id) => {
    if (ids.includes(id)) {
      const index = ids.indexOf(id);
      console.log(ids)
      let updatedIds = [...ids] 
      updatedIds.splice(index, 1);
      setIds(updatedIds)
    } else {
      let newIds = ids.concat(id)
      console.log(ids)
      setIds(newIds);
    }
  }
  const renderEvents = (data) => {
    if (data) {
      var x = Object.keys(data).map((e, index) => {
        return (
          data[e] && data[e].map(tableSpanRow => {
            return (
              <tr key={tableSpanRow.id} ref={el => inputRef.current[e] = el} tabIndex={0}>
                <td>{tableSpanRow.id}</td>
                <td>{tableSpanRow.employee.firstname + ', ' + tableSpanRow.employee.lastname}</td>
                <td>{tableSpanRow.title}</td>
                {tableSpanRow.replacement !== null && tableSpanRow.replacement !== "" ? (
                  <td>{tableSpanRow.replacement}</td>
                ) : <td></td>}
                <td>{moment(tableSpanRow.start).format("YYYY-MM-DD h:mm:ss")}</td>
                <td>{moment(tableSpanRow.end).format("YYYY-MM-DD h:mm:ss")}</td>
                <td>{tableSpanRow.type}</td>
                {tableSpanRow.status === "L1" ? (
                  <td>Need TPM approval</td>
                ) : (
                  <td>Need LM approval</td>
                )
                }
                <td>
                  <input
                    className="m-1"
                    type="checkbox"
                    checked={ids.find(x => x == tableSpanRow.id) ? true : false}
                    onChange={() => createArr(tableSpanRow.id)}
                  />
                </td>
                <td rowSpan={1}>{e}
                </td>
              </tr>
            )
          }
          )


        );
      });
      return x;
    }
  }

  const approveUpdate = async () => {
    const data = {
      ids: ids,
      status: user.auth.role
    };

    Axios.post(`${config.baseURL + config.baseLOCATION}/schedule/approve`, data, { withCredentials: true })
      .then(response => {
        response.data.data.forEach(item => {
          Object.keys(events).forEach(x => {
            let updatedEvents = events[x].filter(function (el) { return el.id != item; });
            events[x] = updatedEvents
            setEvents(events)
          })
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  const declineUpdate = async () => {
    if (ids.length > 0) {
      const data = {
        ids: ids,
        status: 'L0'
      };

      Axios.post(`${config.baseURL + config.baseLOCATION}/schedule/delete`, data, { withCredentials: true })
        .then(response => {
          response.data.data.forEach(item => {
            Object.keys(events).forEach(x => {
              let updatedEvents = events[x].filter(function (el) { return el.id != item; });
              events[x] = updatedEvents
              setEvents(events)
            })
          })
        })
        .catch(error => {
          console.log(error)
        })
    }
  }




  return (
    <div>
      {(user.auth.role === "L3" || user.auth.role === "L2") &&
        events ? (
        <>
          <>
            <div className="tags-input">
              <ul id="tags">
                {state.monthList.map((item, index) => {
                  return <li key={index} className="tag"
                    onClick={() => { scrollEffect(item) }}
                  ><span>{item}</span></li>
                })}
              </ul>
            </div>
          </>
          <div className="text-center m-4 row">
            <div className="col">
              <button
                onClick={() => approveUpdate()}
                className="btn btn-success"
                disabled={ids.length==0}
              >
                Approve selected
              </button>
            </div>
            <div className="col">
              <button
                onClick={() => declineUpdate()}
                disabled={ids.length==0}
                className="btn btn-danger"
              >
                Decline selected
              </button>
            </div>
          </div>
          <table id='approval-table'>
            <thead>
              <tr>

                <th>id</th>
                <th>Resource Name</th>
                <th>Title</th>
                <th>Replacement Resource</th>
                <th>Start</th>
                <th>Type</th>
                <th>End</th>
                <th>Status</th>
                <th>Check</th>
                <th>Month</th>
              </tr>
            </thead>
            <tbody>
              {renderEvents(events)}
            </tbody>
          </table>
        </>
      ) : (
        <div className="noApprove text-center">
          <h1>No requests to approve, yet...</h1>
        </div>
      )}
    </div>
  );
}
