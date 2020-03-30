import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import { Redirect } from "react-router-dom";

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  async handleSubmit(event) {
    event.preventDefault()
  }


  render() {
    if (this.props.token) {
      return <Redirect to='/' />
    }

    return (
      <>
        <Typography className="Form-title">Sign In</Typography>
        <form onSubmit={this.handleSubmit}>
          <label for="email">Email:</label>
          <input
            className='Form-text-input'
            name="email"
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
            placeholder="johndoe@gmail.com"
            required />
          <label for="password">Password:</label>
          <input
            className='Form-text-input'
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
            placeholder="Password"
            required />
          <button className='Form-submit' type='submit'>Sign In</button>
        </form>
      </>
    );
  }
}
