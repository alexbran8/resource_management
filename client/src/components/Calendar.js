import React, { useState, useEffect, useCallback } from 'react';
import Scheduler, { SchedulerData, ViewTypes } from 'react-big-scheduler';
import Axios from "axios";
//include react-big-scheduler/lib/css/style.css for styles, link it in html or import it here
import 'react-big-scheduler/lib/css/style.css';
import withDragDropContext from './withDnDContext';

import CustomModal from "./Modal";
import Filter from "./Filter";
import { config } from "../config";

let schedulerData = new SchedulerData(new Date(), ViewTypes.Week, false, false,
 {schedulerMaxHeight: 800}
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
  const [editEvent, setEditEvent] = useState()
  // eslint-disable-next-line no-unused-vars
  const [count, setCount] = useState()
  const [refresh, setRefresh] = useState(1);
  var moment = require("moment");

  useEffect(() => {
		if(refresh === 0){
			setRefresh(1);
      setCount()
		}
	}, [refresh])
	
	useEffect(() => {
		setRefresh(0);
	}, [count]);


  const sendData = async(data, viewModal) => {

    console.log('sendData', data)
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
    
    // const response = await Axios.post(`${ config.baseURL + baseLOCATION }/schedule/add`, data, {withCredentials: true} );

    console.log('data',data);
    if (data.id === undefined) {
      data.id = 0;
      console.log("aici");
    }

    let newFreshId = 0;

    let newEvent = {
      id: newFreshId,
      title: data.title,
      start: data.start,
      end: data.end,
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
    const types = await Axios.get(`${ config.baseURL + config.baseLOCATION }/types`, {withCredentials: true});
    if (types) setTypes(types.data.data);
  }


 const  toggleLegend = () => {
    this.setState({ legend: !this.state.legend });
  }

  const reset = () =>  {
    setEvent(undefined)
  }

  const resetEdit = () =>  {
    setEditEvent(undefined)
  }



  useEffect(() => {
    getType();
    Axios.post(`${config.baseURL + config.baseLOCATION}/schedule/get`, params, {withCredentials: true})
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
    Axios.post(`${config.baseURL + config.baseLOCATION}/usersPrivate/get/filter`, data, {withCredentials: true})
      .then(res => {
        const fmtUsers = res.data.filterUsers.reduce((prev, entry) => {
          prev.push({
            id: entry.nokiaid,
            name: `${entry.lastname}, ${entry.firstname}`,
          });
          return prev;
        }, []);
        schedulerData.setResources(fmtUsers);

      }

      )
  }, []);

  const onViewChange = (schedulerData, view) => {
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
    if (sessionStorage.getItem('roles')=== "L3") {
      if (
        window.confirm(
          `Are you sure you want to delete: ${event.title}  assigned to ${event.name} with ${event.replacement} as replacement?`
        )
      )
        console.log(schedulerData)
        schedulerData.removeEvent(event);
        // Axios.delete(`${ config.baseURL + config.baseLOCATION }/schedule/delete/${event.id}`, event,  {withCredentials: true});
        
        setViewModal2(schedulerData);
        setCount(1)
        console.log(schedulerData)
    } else {
      return;
    }
  };
const updateData = (data) => {
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
    // const response = await Axios.post(
    //   `${baseURL}/schedule/update/${data.id}`,
    //   data, {withCredentials: true}
    // );
    // if (!response) {
    //   alert("failed");
    // }
    console.log(events)
    console.log(data.id)
      events.map((item) => {
          item.id === data.id? item = data: null;
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
    setRenderCounter(o => ++o);
  };

  const nextClick = schedulerData => {
    setEvents(schedulerData.events)
    schedulerData.next();
    schedulerData.setEvents(events);
    setViewModal(schedulerData);
    setRenderCounter(o => ++o);
  };

  const  eventClicked = (schedulerData, event) => {
    alert(
      `You clicked event: ${event.title} with ${
        event.replacement ? event.replacement : `no one`
      } as replacement.`
    );
  };


  const slotClickedFunc = (schedulerData, slot) => {
    console.log(slot)
    setSlot(slot.slotId);
    console.log(slot)
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

  let params = { 'admin': true, 'operational': false }

  let data = {
    line_manager: "",
    team: "",
    coordinator: "",
    employeers: "",
    resources: "",
    admin: true,
    operational: false,
  }

  return (
    <div>
      <Filter />
        {event || editEvent ? (
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
      {slot ? (
        <DetailModal
          level={this.props.role}
          resetSlot={() => this.resetSlot()}
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