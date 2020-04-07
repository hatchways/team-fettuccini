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

  handleSubmit(event) {
    event.preventDefault()

    let error = ''
    if (this.state.password !== this.state.passwordConfirm) {
      error = "Passwords must match"
      this.setState({ ...this.state, error })
      return
    }

    if (this.state.password.length < 6) {
      error = "Password must be at least 6 characters long"
      this.setState({ ...this.state, error })
      return
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
      body: JSON.stringify({ username: this.state.name, email: this.state.email, password: this.state.password })
    };

    fetch('/users', requestOptions)
        .then(res => {
          if (res.status === 201){
            this.props.login();
          } else {
            console.log(res.message);
          }
        })
        .catch (error => {
          console.log(error.message)
        }) 
    

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
            minLength='6'
            value={this.state.passwordConfirm}
            onChange={this.handleConfirmPassword}
            placeholder="Enter Password Again"
            required />
          {errorMessage}
          <Button variant="contained" color="primary" type='submit'>Sign Up</Button>
        </form>
      </>
    );
  }
}
