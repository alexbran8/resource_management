import React, { useState, useEffect, useCallback } from 'react';
import Scheduler, { SchedulerData, ViewTypes } from 'react-big-scheduler';
import Axios from "axios";
//include react-big-scheduler/lib/css/style.css for styles, link it in html or import it here
import 'react-big-scheduler/lib/css/style.css';
import withDragDropContext from './withDnDContext';

import DetailModal from "./DetailModal";
import OperationalModal from "./Operational_Modal";

import CustomModal from "./Modal";
import Filter from "./Filter";
import { config } from "../config";

import { AlertComponent } from "./Alert/Alert"

// import "./Scheduler.scss"

let schedulerData = new SchedulerData(new Date(), ViewTypes.Week, false, false,
  { schedulerMaxHeight: 800 }
);
schedulerData.localeMoment.locale('en');


function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick(tick => tick + 1);
  }, [])
  return update;
}

const Calendar = () => {
  const [viewModal2, setViewModal2] = useState(schedulerData);
  const [viewModal, setViewModal] = useState(schedulerData);
  const [events, setEvents] = useState([])
  const [event, setEvent] = useState()
  const [slot, setSlot] = useState()
  const [types, setTypes] = useState()
  const [params, setParams] = useState({ 'admin': true, 'operational': false })
  const [editEvent, setEditEvent] = useState()
  const [showAlerts, setShowAlerts] = useState < boolean > (true)
  const [filter, setFilter] = useState({
    line_manager: "",
    team: "",
    tpm: "",
    employeers: "",
    resources: ""
  })

  // TODO: check if planned vacation and vacation are still necessary

  // eslint-disable-next-line no-unused-vars
  const [count, setCount] = useState()
  const [refresh, setRefresh] = useState(1);
  var moment = require("moment");

  useEffect(() => {
    if (refresh === 0) {
      setRefresh(1);
      setCount()
    }
  }, [refresh])

  useEffect(() => {
    setRefresh(0);
  }, [count]);


  const sendData = async (data, viewModal) => {

    // FIXME: check if token is valid

    // TODO: go to login page if token has expired

    data.schedulerData = ""

    // console.log(data.start)

    var date2 = new Date(data.start)
    var end2 = new Date(data.end)
    var updatedStart = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), 8, 0, 0)
    var updatedEnd = new Date(end2.getFullYear(), end2.getMonth(), end2.getDate(), 17, 0, 0)

    data.start = updatedStart
    data.end = updatedEnd
    data.status =
      localStorage.getItem("permisiuni") !== undefined
        ? localStorage.getItem("permisiuni")
        : "L1";
    console.log(data.status);
    if (
      data.bgColor === undefined ||
      data.bgColor === null ||
      data.bgColor === ""
    ) {
      data.bgColor = "#5DB5F4";
    }
    if (data.type === undefined || data.type === null || data.type === "") {
      data.type = "Null";
    }
    // console.log(data.findIndex(x => x == 'headers'))
    // data.headers = ""
    Axios.post(`${config.baseURL + config.baseLOCATION}/schedule/add`, data, { withCredentials: true })
    // const response = await Axios.post(`${ config.baseURL + config.baseLOCATION }/schedule/add`, data, {method: "POST",credentials: "include",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     "Access-Control-Allow-Credentials": true,
    //     "Access-Control-Allow-Origin": '*'
    //   }},
    // {withCredentials: true} 
    // );

    console.log('data', data);
    if (data.id === undefined) {
      data.id = 0;
      console.log("aici");
    }

    let newFreshId = 0;

    let newEvent = {
      id: newFreshId,
      title: data.title,
      start: updatedStart,
      end: updatedEnd,
      resourceId: data.nokiaid,
      bgColor: "#E74C3C"
    };
    setCount(data.title)
    setEvents(schedulerData.events)
    schedulerData.addEvent(newEvent);
    setViewModal(schedulerData);

    setEvent(undefined)
  }



  const getType = async () => {
    const types = await Axios.get(`${config.baseURL + config.baseLOCATION}/types`, { withCredentials: true });
    if (types) setTypes(types.data.data);
  }




  const reset = () => {
    setEvent(undefined)
  }

  const resetEdit = () => {
    setEditEvent(undefined)
  }

  useEffect(() => {
    setTimeout(() => {
      setShowAlerts(false);
    }, 10000);
  }, []);

  useEffect(() => {
    getType();

    Axios.post(`${config.baseURL + config.baseLOCATION}/schedule/get`, params, { withCredentials: true })
      .then(res => {
        const fmtEvents = res.data.schedule.reduce((prev, entry) => {
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
        viewModal2.setEvents(fmtEvents);
        setEvents(fmtEvents)

      }
      )
    Axios.post(`${config.baseURL + config.baseLOCATION}/usersPrivate/get/filter`, data, { withCredentials: true })
      .then(res => {
        const fmtUsers = res.data.filterUsers.reduce((prev, entry) => {
          prev.push({
            id: entry.nokiaid,
            name: `${entry.lastname}, ${entry.firstname}`,
          });
          return prev;
        }, []);
        // setResources(fmtUsers)
        console.log(fmtUsers)
        schedulerData.setResources(fmtUsers);

      }
      )
    // setCount(0)
  },
    []);

  const onViewChange = (schedulerData, view) => {
    console.log(view)
    setEvents(schedulerData.events)
    schedulerData.setViewType(
      view.viewType,
      view.showAgenda,
      view.isEventPerspective
    );
    schedulerData.setEvents(events);
    setViewModal(schedulerData);
  };

  const deleteItem = (schedulerData, event) => {
    if (sessionStorage.getItem('roles') === "L3") {
      if (
        window.confirm(
          `Are you sure you want to delete: ${event.title}  assigned to ${event.name} with ${event.replacement} as replacement?`
        )
      )
        console.log(schedulerData)
      schedulerData.removeEvent(event);
      Axios.delete(`${config.baseURL + config.baseLOCATION}/schedule/delete/${event.id}`, { withCredentials: true });

      setViewModal2(schedulerData);
      setCount(1)
      console.log(schedulerData)
    } else {
      return;
    }
  };

  const updateData = async (data) => {
    if (
      data.bgColor === undefined ||
      data.bgColor === null ||
      data.bgColor === ""
    ) {
      data.bgColor = "#5DB5F4";
    }
    if (data.type === undefined || data.type === null || data.type === "") {
      data.type = "Null";
    }
    const response = await Axios.post(
      `${baseURL}/schedule/update/${data.id}`,
      data, { withCredentials: true }
    );
    if (!response) {
      alert("failed");
    }
    console.log(events)
    console.log(data.id)
    events.map((item) => {
      item.id === data.id ? item = data : null;
    })
    console.log(events)
    schedulerData.setEvents(events);
    setViewModal2(schedulerData)


    console.log(data)
    // setViewModal2(data.schedulerData);
    setCount(0)
    resetEdit();
    // this.getType();
  }

  const editItem = (schedulerData, event) => {
    alert("This feature is currently under development. Please delete and add event as temporary solution... ")
    // if (sessionStorage.getItem('roles') === "L3") {
    //   let editEvent = {
    //     id: event.id,
    //     // schedulerData: schedulerData,
    //     nokiaid: event.resourceId,
    //     title: event.title,
    //     type: event.type,
    //     replacement: event.replacement,
    //     start: event.start,
    //     end: event.end,
    //     createdBy: event.createdBy,
    //     status: event.status,
    //   };
    //   setEditEvent(editEvent)
    //   console.log(event);
    // } else {
    //   return;
    // }
  };
  const resetSlot = () => {
    setSlot(undefined);
  }

  const onSelectDate = (schedulerData, date) => {
    setEvents(schedulerData.events)
    schedulerData.setDate(date)
    schedulerData.setEvents(events);
    setViewModal(schedulerData);
  };

  const prevClick = schedulerData => {
    setEvents(schedulerData.events)
    schedulerData.prev();
    schedulerData.setEvents(events);
    setViewModal(schedulerData);
    // setRenderCounter(o => ++o);
  };

  const nextClick = schedulerData => {
    setEvents(schedulerData.events)
    schedulerData.next();
    schedulerData.setEvents(events);
    setViewModal(schedulerData);
    // setRenderCounter(o => ++o);
  };

  const eventClicked = (schedulerData, event) => {
    alert(
      `You clicked event: ${event.title} with ${event.replacement ? event.replacement : `no one`
      } as replacement.`
    );
  };

  const slotClickedFunc = (schedulerData, slot) => {
    console.log(slot)
    setSlot(slot.slotId);

  };

  const newEvent = async (schedulerData, slotId, slotName, start, end, type, item) => {
    let newEvent = {
      schedulerData: schedulerData,
      id: 0,
      start: start,
      end: end,
      nokiaid: slotId,
      // createdBy: this.props.name,
      // status: this.props.role,
      fullname: slotName,
      dayDiff: moment(end).diff(start, "days") + 1,
      // bgColor: "purple"
    };
    console.log('data', schedulerData)
    setEvent(newEvent)
  };

  let data = {
    line_manager: "",
    team: "",
    tpm: "",
    employeers: "",
    resources: "",
    admin: true,
    operational: false,
  }

  const updateEventStart = (schedulerData, event, newStart) => {
    let newEventStart = {
      id: event.id,
      nokiaid: event.resourceId,
      start: newStart,
      end: event.end,
      type: event.type,
      title: event.title,
      replacement: event.replacement,
      status: "L3",
    };

    Axios.post(`${config.baseURL + config.baseLOCATION}/schedule/update/${event.resourceId}`, newEventStart, { withCredentials: true })
      .then(response => {
        console.log(response)
        schedulerData.updateEventStart(event, newStart);
        this.setState({
          viewModel: schedulerData,
        });
      })
      .catch(function (error) {
        console.log({ error });
        alert(error)
      })


  };

  const updateEventEnd = (schedulerData, event, newEnd) => {
    let newEventEnd = {
      id: event.id,
      nokiaid: event.resourceId,
      end: newEnd,
      start: event.start,
      title: event.title,
      status: event.status,
      type: event.type,
      replacement: event.replacement,
    };

    Axios.post(`${config.baseURL + config.baseLOCATION}/schedule/update/${event.resourceId}`, newEventEnd, { withCredentials: true })
      .then(response => {
        console.log(response)
        schedulerData.updateEventEnd(event, newEnd);
        this.setState({
          viewModel: schedulerData,
        });
      })
      .catch(function (error) {
        console.log({ error });
        alert(error)
      })

  };


  const _filter = (value, field) => {
    filter[field] = value
    Axios.post(`${config.baseURL + config.baseLOCATION}/usersPrivate/get/filter`, filter, { withCredentials: true })
      .then(res => {
        console.log(value, 'here', field)
        const fmtUsers = res.data.filterUsers.reduce((prev, entry) => {
          prev.push({
            id: entry.nokiaid,
            name: `${entry.lastname}, ${entry.firstname}`,
          });
          return prev;
        }, []);
        // setResources(fmtUsers)
        console.log(fmtUsers)
        schedulerData.setResources(fmtUsers);
        setCount(0)

      }

      )
  }

  const updateState = (data) => {
    let newEvent = {
      // schedulerData: schedulerData,
      id: 0,
      start: data.start,
      end: data.end,
      nokiaid: data.nokiaid,
      // createdBy: this.props.name,
      status: 'L3',
      // fullname: slotName,
      // dayDiff: moment(end).diff(start, "days") + 1,
      bgColor: "#cc33ff",
      title: data.task,
      start: data.start,
      end: data.end,
      resourceId: data.nokiaid,
    };
    schedulerData.addEvent(newEvent);
    setViewModal(schedulerData);
    setCount(0)

    setEvent(undefined)
  }
  const _eventsFilter = (state, field) => {

    setParams(state)

    Axios.post(`${config.baseURL + config.baseLOCATION}/schedule/get`, state, { withCredentials: true })
      .then(res => {
        const fmtEvents = res.data.schedule.reduce((prev, entry) => {
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
        viewModal2.setEvents(fmtEvents);
        setEvents(fmtEvents)
        setCount(0)

      }
      )
  }

  // const filter = async (propsData) => {
  //   var data2 = []

  //   filter2()

  //   // Axios.post(`${config.baseURL + config.baseLOCATION}/usersPrivate/get/filter`, data, {withCredentials: true})
  //   // .then(res => {
  //   //   const fmtUsers = res.data.filterUsers.reduce((prev, entry) => {
  //   //     prev.push({
  //   //       id: entry.nokiaid,
  //   //       name: `${entry.lastname}, ${entry.firstname}`,
  //   //     });
  //   //     return prev;
  //   //   }, []);
  //   //   // setResources(fmtUsers)
  //   //   // console.log(fmtUsers)
  //   //   // schedulerData.setResources(fmtUsers);

  //   // }

  //   // )
  // }

  return (
    <div>
      <Filter
        filter={(value, field) => _filter(value, field)}
        eventsFilter={(value, field) => _eventsFilter(value, field)}
      />
      {(event || editEvent) && params.admin === true ? (
        <CustomModal
          resources={schedulerData.resources}
          reset={() => reset()}
          resetEdit={() => resetEdit()}
          event={event}
          editEvent={editEvent}
          sendData={(e) => sendData(e, schedulerData)}
          updateData={(e) => updateData(e)}
          types={types}
        />
      ) : null}
      {(event || editEvent) && params.operational === true ? (
        <OperationalModal
          resources={schedulerData.resources}
          reset={() => reset()}
          resetEdit={() => resetEdit()}
          event={event}
          editEvent={editEvent}
          updateState={(e) => updateState(e, data)}
          types={types}
        />
      ) : null}
      {slot ? (
        <DetailModal
          level={sessionStorage.getItem('roles')}
          resetSlot={() => resetSlot()}
          id={slot}
        />
      ) : null}
      {refresh ?
        <Scheduler
          schedulerData={viewModal2}
          prevClick={prevClick}
          nextClick={nextClick}
          eventItemClick={eventClicked}
          onViewChange={onViewChange}
          onSelectDate={onSelectDate}
          updateEventStart={updateEventStart}
          updateEventEnd={updateEventEnd}
          newEvent={newEvent}
          slotClickedFunc={slotClickedFunc}
          viewEventClick={sessionStorage.getItem('roles') === "L3" ? editItem : null}
          viewEventText="Edit"
          viewEvent2Text={sessionStorage.getItem('roles') === "L3" ? "Delete" : null}
          viewEvent2Click={sessionStorage.getItem('roles') === "L3" ? deleteItem : null}
        />
        : null}
    </div>
  );
};

export default withDragDropContext(Calendar);