import React, { Component } from "react";

import { useForm, Controller } from 'react-hook-form'
import { connect } from "react-redux";
import { compose } from "redux";
import { SignUp } from "../actions/index"
import { Form, Select } from "react-bootstrap"

// import "../css/signup.scss"


import { useSelector, useDispatch } from 'react-redux'
import CustomInput from "./CustomInput";
import * as actions from "../actions";
import { fromPairs } from "lodash";

const defaultValues = {
  select: "",
  input: ""
};

export const signUpForm = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, control } = useForm({ defaultValues });

  const OnSubmit = async (data) => {
    dispatch(await SignUp(data))
  }


  return (
    <Form className="containerForm" onSubmit={handleSubmit(OnSubmit)}>
      <Form.Row>
        <Form.Group controlId="nokiaid">
          <Form.Label>NokiaID</Form.Label>
          <Form.Control type="text" label="Enter NokiaID" required={true} name="nokiaid" defaultValue="x" {...register('nokiaid')} />
        </Form.Group>
        <Form.Group controlId="firstname">
          <Form.Label>FirstName</Form.Label>
          <Form.Control type="text" label="Enter NokiaID" required={true} name="firstname" defaultValue="x" {...register('firstname')} />
        </Form.Group>
        <Form.Group controlId="lastname">
          <Form.Label>LastName</Form.Label>
          <Form.Control type="text" label="Enter NokiaID" required={true} name="lastname" defaultValue="x" {...register('lastname')} />
        </Form.Group>
        <Form.Group controlId="upi">
          <Form.Label>UPI</Form.Label>
          <Form.Control type="text" label="Enter NokiaID" required={true} name="upi" defaultValue="x" {...register('upi')} />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>EMAIL</Form.Label>
          <Form.Control type="email" label="Enter NokiaID" required={true} name="email" defaultValue="@nokia.com" {...register('email')} />
        </Form.Group>
        <Form.Group controlId="shortId">
          <Form.Label>shortId</Form.Label>
          <Form.Control type="text" label="Enter NokiaID" required={true} name="shortId" defaultValue="xx" {...register('shortId')} />
        </Form.Group>
        <Form.Group controlId="employeer">
          <Form.Label>Employeer</Form.Label>
          <Form.Control as="select" label="select employeer" name="employeer" defaultValue="" {...register('employeer')}>
            <option>Deltatel</option>
            <option>Nokia</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="upalu">
          <Form.Label>Upalu</Form.Label>
          <Form.Control type="text" label="Enter NokiaID" required={true} name="upalu" defaultValue="x" {...register('upalu')} />
        </Form.Group>
        <Form.Group controlId="city">
          <Form.Label>CITY</Form.Label>
          <Form.Control as="select" label="select CITY" name="city" defaultValue="" {...register('city')}>
            <option>TM</option>
            <option>BU</option>
          </Form.Control>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group controlId="main_team">
          <Form.Label>main_team</Form.Label>
          <Form.Control type="text" label="Enter NokiaID" required={false} name="main_team" defaultValue="" {...register('main_team')} />
        </Form.Group>
        <Form.Group controlId="second_team">
          <Form.Label>second_team</Form.Label>
          <Form.Control type="text" label="Enter NokiaID" required={false} name="second_team" defaultValue="" {...register('second_team')} />
        </Form.Group>
        <Form.Group controlId="third_team">
          <Form.Label>third_team</Form.Label>
          <Form.Control type="text" label="Enter NokiaID" required={false} name="third_team" defaultValue="" {...register('third_team')} />
        </Form.Group>
        <Form.Group controlId="fourth_team">
          <Form.Label>fourth_team</Form.Label>
          <Form.Control type="text" label="Enter NokiaID" required={false} name="fourth_team" defaultValue="" {...register('fourth_team')} />
        </Form.Group>
        <Form.Group controlId="activity">
          <Form.Label>activity</Form.Label>
          <Form.Control type="text" label="Enter NokiaID" required={false} name="activity" defaultValue="" {...register('activity')} />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group controlId="line_manager_firstname">
          <Form.Label>line_manager_firstname</Form.Label>
          <Form.Control type="text" label="Enter NokiaID" required={true} name="line_manager_firstname" defaultValue="CRISAN, Cecilia" {...register('line_manager_firstname')} />
        </Form.Group>
        <Form.Group controlId="line_manager_lastname">
          <Form.Label>line_manager_lastname</Form.Label>
          <Form.Control type="text" label="Enter NokiaID" required={true} name="line_manager_lastname" defaultValue="CRISAN, Cecilia" {...register('line_manager_lastname')} />
        </Form.Group>
        <Form.Group controlId="tpm_firstname">
          <Form.Label>tpm_firstname</Form.Label>
          <Form.Control type="text" label="Enter NokiaID" required={true} name="tpm_firstname" defaultValue="CRISAN, Cecilia" {...register('tpm_firstname')} />
        </Form.Group>
        <Form.Group controlId="tpm_lastname">
          <Form.Label>tpm_firstname</Form.Label>
          <Form.Control type="text" label="Enter NokiaID" required={true} name="tpm_lastname" defaultValue="CRISAN, Cecilia" {...register('tpm_lastname')} />
        </Form.Group>
        <Form.Group controlId="level">
          <Form.Label>Level</Form.Label>
          <Form.Control as="select" label="select level" name="level" defaultValue="L1" {...register('level')}>
            <option>L0</option>
            <option>L1</option>
            <option>L2</option>
            <option>L3</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>password</Form.Label>
          <Form.Control type="text" label="Enter password" required={true} name="password" defaultValue="1" {...register('password')} />
        </Form.Group>
      </Form.Row>
      {/* 
          {this.props.errorMessage ? (
            <div className="alert  alert-danger">
              {this.props.errorMessage}
            </div>
          ) : null} */}
      <button type="submit" className="button">
        Sign Up
            </button>
    </Form>

  )
}
