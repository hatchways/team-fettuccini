import React, { Component } from "react";
import { TextField, FormLabel, Button } from "@material-ui/core";

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      error: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleSubmit(event) {
    event.preventDefault()

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
      body: JSON.stringify({ email: this.state.email, password: this.state.password })
    };

    fetch('/users/login', requestOptions)
      .then(res => {
        if (res.status === 200) {
          return res.json()
        } else {
          console.error('API error /users/login ', res);
        }
      }).then(data => {
        this.props.login(data.user);
        console.error('data.user ', data.user);
        console.error('data.user.username ', data.user.username);
      })
      .catch(error => {
        console.log(error.message)
      })
  }




  render() {
    const errorMessage = this.state.error.length !== 0 ? <p className="Form-warning">{this.state.error}</p> : null;
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <FormLabel htmlFor="email">Email:</FormLabel>
          <TextField
            variant="outlined"
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
            id="password"
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
            placeholder="Password"
            required />
          {errorMessage}
          <Button variant="contained" color="primary" type='submit'>Sign In</Button>
        </form>
      </>
    );
  }
}
