import React, { useState } from "react";
import { FormLabel, TextField, Button, FormControl } from "@material-ui/core";

import { withStyles } from "@material-ui/core/styles";
import style from './styleAuth'

export default withStyles(style)(function SignUp(props) {

    const [ state, setState ] = useState({
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      error: ''
    });


  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    let error = ''
    if (state.password !== state.passwordConfirm) {
      error = "Passwords must match"
      setState({ ...state, error })
      return
    }

    if (state.password.length < 6) {
      error = "Password must be at least 6 characters long"
      setState({ ...state, error })
      return
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
      body: JSON.stringify({ username: state.name, email: state.email, password: state.password })
    };
    
    let failed = false;
    fetch('/users', requestOptions)
      .then(res => {
    	  if (res.status!== 201) failed = true;
    	  return res.json();
      })
      .then(data => {
          if (failed) {
            if (data.errors == undefined) {
              setState({...state, error: data.message })
            } else if (data.errors.email != undefined) {
          	  setState({...state, error: "Please enter valid email" })
            }
          } else {
        	  props.login(data.user);
          }
      })
      .catch(error => {
        console.log(error.message)
      })


  }

  const handleConfirmPassword = (event) => {
    let error = state.password !== event.target.value
      ? "Passwords must match"
      : '';

    setState({
      ...state,
      [event.target.name]: event.target.value,
      error
    })
  }

    const { classes } = props
    const errorMessage = state.error.length !== 0 ? <p className={classes.formWarning}>{state.error}</p> : null;
    console.log("Error", errorMessage);
    return (
      <>
        <form className={classes.form} onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel htmlFor="name">Name:</FormLabel>
            <TextField
              variant="outlined"
              id="name"
              name="name"
              type="text"
              value={state.name}
              onChange={handleChange}
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
              value={state.email}
              onChange={handleChange}
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
              value={state.password}
              onChange={handleChange}
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
              value={state.passwordConfirm}
              onChange={handleConfirmPassword}
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
})
