import PropTypes from "prop-types";
import React, { Component } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./Homepage.scss"

const HomePage = () => {
  const user = useSelector((state) => ({ auth: state.auth }));
  return (
    <div>
      <div className="toppane">
        {!user.auth ? (<>
          <h1>Welcome!</h1>
        </>
        ) : (
          <div>
            {console.log(user)}
            <h1>You have login succcessfully!</h1>
            <h2>Welcome, {user.auth.name}!</h2>
          </div>
        )}
      </div>
      {/* </div> */}
      <div className="flexbox-container">
        <div className="box fill"> <div className="lefpane">
          <h4>Latest updates:</h4>
          <ul>
            <li>about page in dev</li>
          </ul>
        </div></div>
        <div className="box fillx2"><div className="middlepane">
          <h4>This is the Planning Tool application</h4>
          <h5>This is a purpose built web application in order to server any planning needs a team may encounter:</h5>
          <ul>
            <li>administrative planning (vacations, recovery days, specific weekly schedules: e.g. schifted schedules)</li>
            <li>operational planning (daily tasks, task reminders, tasks based on norms for different scenarios)</li>
            <li>check that time writting has been reported correctly in external tools</li>
          </ul>
          <h5>From development perspective, some major facts need to be presented:</h5>
          <ul>
            <li>this used the most modern web development frameworks (node.JS and react.JS), used also by industries main representatives (e.g. Facebook, etc.)</li>
            <li>modern frameworks have the benefit on increased performance and User eXperience, as this client application is being served as a Single Page Application</li>
            <li>authentification is being handled by Microsoft Azure; Role Based Authentification done through NIMS groups</li>
            <li>easy scalable as it is being served from a docker container (multiple instances can be deployd and taylored to a load balancer to handle multiple user requests)</li>
            <li>easy developemnt, anyone who whishes to take part in the development, with minimum JS knowledge can contribute</li>
          </ul>
        </div></div>
        <div className="box fill"><div className="rightpane">
          <h4>Some numbers:</h4>
          <ul>
            <li>number of uers:</li>
            <li>number of registerd tasks:</li>
            <li>daily tasks average:</li>
          </ul>
        </div></div>
      </div>
      {/* <div className="home-container">
      <div className="flex-item">
          <div className="lefpane">
            <h4>Latest updates:</h4>
            <ul>
              <li>about page in dev</li>
            </ul>
          </div>
        </div>
        <div className="flex-item">
          <div className="middlepane">
            <h4>This is the Planning Tool application</h4>
            <h5>This is a purpose built web application in order to server any planning needs a team may encounter:</h5>
            <ul>
              <li>administrative planning (vacations, recovery days, specific weekly schedules: e.g. schifted schedules)</li>
              <li>operational planning (daily tasks, task reminders, tasks based on norms for different scenarios)</li>
              <li>check that time writting has been reported correctly in external tools</li>
            </ul>
            <h5>From development perspective, some major facts need to be presented:</h5>
            <ul>
              <li>this used the most modern web development frameworks (node.JS and react.JS), used also by industries main representatives (e.g. Facebook, etc.)</li>
              <li>modern frameworks have the benefit on increased performance and User eXperience, as this client application is being served as a Single Page Application</li>
              <li>authentification is being handled by Microsoft Azure; Role Based Authentification done through NIMS groups</li>
              <li>easy scalable as it is being served from a docker container (multiple instances can be deployd and taylored to a load balancer to handle multiple user requests)</li>
              <li>easy developemnt, anyone who whishes to take part in the development, with minimum JS knowledge can contribute</li>
            </ul>
          </div>
        </div>
        <div className="flex-item">
            <div className="rightpane">
              <h4>Some numbers:</h4>
              <ul>
                <li>number of uers:</li>
                <li>number of registerd tasks:</li>
                <li>daily tasks average:</li>
              </ul>
            </div>
          </div>
      </div> */}
    </div>
  );
}


export default HomePage;