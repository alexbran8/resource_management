import React, { useState, useEffect } from 'react';
import Scheduler, { SchedulerData, ViewTypes } from 'react-big-scheduler';
import Axios from "axios";
//include react-big-scheduler/lib/css/style.css for styles, link it in html or import it here
import 'react-big-scheduler/lib/css/style.css';
import withDragDropContext from './withDnDContext';

import CustomModal from "./Modal";
import { config } from "../config";

// import { resources, events } from 'pages/calendar/data';

let schedulerData = new SchedulerData('2021-05-20', ViewTypes.Week);
schedulerData.localeMoment.locale('en');

const Calendar = () => {
  const [viewModal2, setViewModal2] = useState(schedulerData);
  const [viewModal, setViewModal] = useState(schedulerData);
  const [events, setEvents] = useState([])
  const [event, setEvent] = useState()
  const [slot, setSlot] = useState()
  const [editEvent, setEditEvent] = useState()
  // eslint-disable-next-line no-unused-vars
  const [renderCounter, setRenderCounter] = useState(0);
  var moment = require("moment");

  useEffect(() => {
    Axios.post(`${config.baseURL + config.baseLOCATION}/schedule/get`, params)
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
    Axios.post(`${config.baseURL + config.baseLOCATION}/usersPrivate/get/filter`, data)
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

  const slotClickedFunc = (schedulerData, slot) => {
    console.log(slot)
    setSlot(slot.slotId);
    console.log(slot)
  };
  const newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
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
    alert(newEvent)
    console.log(newEvent)
    setEditEvent(newEvent)
    // let newFreshId = 0;
    // schedulerData.events.forEach((item) => {
    //         newFreshId = item.id + 1;
    // });
    //   this.setState({
    //     viewModel: schedulerData
    // })
    //   let newEvent = {
    //     schedulerData: schedulerData,
    //     id: newFreshId,
    //     title: 'Hotline',
    //     start: start,
    //     nokiaid: slotId,
    //     end: end,
    //     repalcement: "",
    //     fullname: slotName,
    //     createdBy: this.props.name,
    //     type: 'Hotline',
    //     status:this.props.role,
    //     dayDiff: moment(end).diff(start, "days") + 1,
    //     resourceId: slotId,
    //     bgColor: '#2ECC71'
    // }
    // this.setState({ event: newEvent });
    // console.log(schedulerData)
    // // Axios.post(`${ config }/schedule/add`, newEvent);
    // schedulerData.addEvent(newEvent);
    // console.log(schedulerData)
    // this.setState({ viewModel: schedulerData });
    // console.log(this.state.viewModel)
    // console.log(schedulerData)
    // schedulerData.addEvent(newEvent);
    // // console.log('here2', newEvent)
    // this.setState({
    //     viewModel: schedulerData
    // })
    // console.log(schedulerData)
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
        {event || editEvent ? (
          <CustomModal
            resources={schedulerData.resources}
            // reset={() => this.reset()}
            // resetEdit={() => this.resetEdit()}
            event={event}
            editEvent={editEvent}
            // sendData={(e) => this.sendData(e, viewModel)}
            // updateData={(e) => this.updateData(e)}
            // types={types}
          />
        ) : null}
      {slot ? (
        <DetailModal
          level={this.props.role}
          resetSlot={() => this.resetSlot()}
          id={slot}
        />
      ) : null}
      <Scheduler
        schedulerData={schedulerData}
        prevClick={prevClick}
        nextClick={nextClick}
        onViewChange={onViewChange}
        onSelectDate={onSelectDate}
        newEvent={newEvent}
        slotClickedFunc={slotClickedFunc}
      />
    </div>
  );
};

export default withDragDropContext(Calendar);