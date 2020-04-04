import React, { Component } from "react";
import { FormLabel, TextField, Button } from "@material-ui/core";

export default class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      error: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this)
  }

  handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    })
  }

  async handleSubmit(event) {
    event.preventDefault()

    let error = ''
    if (this.state.password !== this.state.passwordConfirm) {
      error = "Passwords must match"
      this.setState({ ...this.state, error })
      return
    }

    try {
      await this.props.login()
    } catch (error) {
      console.log(error.message)
    }
  }

  handleConfirmPassword(event) {
    let error = this.state.password !== event.target.value
      ? "Passwords must match"
      : '';

    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
      error
    })
  }

  render() {
    const errorMessage = this.state.error.length !== 0 ? <p className="Form-warning">{this.state.error}</p> : null;

    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <FormLabel htmlFor="name">Name:</FormLabel>
          <TextField
            variant="outlined"
            id="name"
            name="name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
            placeholder="Enter your Name"
            required />
          <FormLabel htmlFor="email">Email:</FormLabel>
          <TextField
            variant="outlined"
            name="email"
            id="email"
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
            placeholder="Enter your Email"
            required />
          <FormLabel htmlFor="password">Password:</FormLabel>
          <TextField
            variant="outlined"
            id="password"
            name="password"
            type="password"
            minLength='6'
            value={this.state.password}
            onChange={this.handleChange}
            placeholder="Enter Password"
            required />
          <FormLabel htmlFor="passwordConfirm">Confirm Password:</FormLabel>
          <TextField
            variant="outlined"
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            value={this.state.passwordConfirm}
            onChange={this.handleConfirmPassword}
            placeholder="Enter Password Again" />
          {errorMessage}
          <Button variant="contained" color="primary" type='submit'>Sign Up</Button>
        </form>
      </>
    );
  }
}
