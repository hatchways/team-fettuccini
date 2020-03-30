import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import { Route, Link } from "react-router-dom";

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
    await this.props.login(
      {
        email: this.state.email,
        password: this.state.password
      }
    )
    const { id, token } = this.props
    if (token) {
      await this.props.getTransactions(id, token)
      this.props.getPortfolio(id, token)
    } else {
      alert('Invalid credentials, please try again')
    }
  }


  render() {
    return (
      <>
        <Typography className="Form-title">Sign In</Typography>
        <form onSubmit={this.handleSubmit}>
          <input
            className='Form-text-input'
            name="email"
            type="text"
            value={this.state.email}
            onChange={this.handleChange}
            placeholder="Enter Email" />
          <input
            className='Form-text-input'
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
            placeholder="Enter Password" />
          <button className='Form-submit' type='submit'>Sign In</button>
        </form>
      </>
    );
  }
}
