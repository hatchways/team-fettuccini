import React, { Component, useState } from "react";
import { TextField, FormLabel, Button, FormControl } from "@material-ui/core";

import { withStyles } from "@material-ui/core/styles";
import style from './styleAuth'

export default withStyles(style)(function Login(props) {
  
    const [ state, setState ]= useState({
      email: '',
      password: '',
      error: ''
    })

  const handleChange = (event) => {
    setState({
        ...state,
    	[event.target.name]: event.target.value
    })
  }
  
  const handleSubmit = (event) => {
    event.preventDefault()

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
      body: JSON.stringify({ email: state.email, password: state.password })
    };

    fetch('/users/login', requestOptions)
      .then(res => {
        if (res.status === 200) {
          return res.json()
        } else {
          console.error('API error /users/login ', res);
        }
      }).then(data => {
        props.login(data.user);
      })
      .catch(error => {
        console.log(error.message)
      })
  }

    const { classes } = props

    const errorMessage = state.error.length !== 0 ? <p className={classes.formWarning}>{state.error}</p> : null;
    return (
      <>
        <form className={classes.form} onSubmit={handleSubmit}>
          <FormControl className="inputBlock">
            <FormLabel htmlFor="email">Email:</FormLabel>
            <TextField
              variant="outlined"
              id="email"
              name="email"
              type="email"
              value={state.email}
              onChange={handleChange}
              placeholder="johndoe@gmail.com"
              required />
          </FormControl>
          <FormControl className="inputBlock">
            <FormLabel htmlFor="password">Password:</FormLabel>
            <TextField
              variant="outlined"
              id="password"
              name="password"
              type="password"
              value={state.password}
              onChange={handleChange}
              placeholder="Password"
              required />
          </FormControl>
          {errorMessage}
          <div>
            <Button variant="contained" color="primary" type='submit'>Sign In</Button>
          </div>
        </form>
      </>
    );
})
