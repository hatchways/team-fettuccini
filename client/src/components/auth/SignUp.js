import React, { Component } from "react";
import { FormLabel, TextField, Button, FormControl } from "@material-ui/core";

import { withStyles } from "@material-ui/core/styles";
import style from './styleAuth'

export default withStyles(style)(class SignUp extends Component {
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
        if (res.status === 201) {
          return res.json()
        } else {
          res.json().then(
        	(result) => {
                if (result.errors == undefined) {
                  this.setState({ error: result.message })
                } else if (result.errors.email != undefined) {
              	  this.setState({ error: "Please enter valid email" })
                }
        	}	  
          );
          
        }
      }).then(data => {
        this.props.login(data.user);
      })
      .catch(error => {
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
    const { classes } = this.props
    const errorMessage = this.state.error.length !== 0 ? <p className={classes.formWarning}>{this.state.error}</p> : null;
    console.log("Error", errorMessage);
    return (
      <>
        <form className={classes.form} onSubmit={this.handleSubmit}>
          <FormControl>
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
          </FormControl>
          <FormControl>
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
          </FormControl>
          <FormControl>
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
          </FormControl>
          <FormControl>
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
          </FormControl>
          {errorMessage}
          <div>
            <Button variant="contained" color="primary" type='submit'>Sign Up</Button>
          </div>
        </form>
      </>
    );
  }
})
