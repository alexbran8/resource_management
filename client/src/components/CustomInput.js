import React, { Component } from "react";

export default class CustomInput extends Component {
  render() {
    const {
      input: { value, onChange }
    } = this.props;
    return (
      <div className="group">
        <input
          name={this.props.id}
          id={this.props.id}
          placeholder={this.props.placeholder}
          type={this.props.type}
          value={value}
          required={this.props.required}
          onChange={onChange}
        />
        <span className="bar" />
        <label htmlFor={this.props.id}> {this.props.label}</label>
      </div>
    );
  }
}
