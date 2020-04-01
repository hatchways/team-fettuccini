import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { TextField, FormLabel, Typography } from "@material-ui/core";

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

    let res
    try {
      res = await this.props.dummyAuth(this.state)
      if (res.error) {
        this.setState({ ...this.state, error: res.error })
        window.alert('error')
      } else {
        window.alert('OK')
        window.localStorage.setItem('token', res.token);

        this.setState({ ...this.state, error: '' })
      }
    } catch (error) {
      console.log(error.message)
    }
  }


  render() {
    if (window.localStorage.token) {
      return <Redirect to='/newgame' />
    }
    return (
      <>
        <Typography className="Form-title">Sign In</Typography>
        <form onSubmit={this.handleSubmit}>
          <FormLabel htmlFor="email">Email:</FormLabel>
          <TextField
            variant="outlined"
            className='Form-text-input'
            id="email"
            name="email"
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
            placeholder="johndoe@gmail.com"
            required />
          <FormLabel htmlFor="password">Password:</FormLabel>
          <TextField
            variant="outlined"
            className='Form-text-input'
            id="password"
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
