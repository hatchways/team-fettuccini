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
  async handleSubmit(event) {
    event.preventDefault()

    let res
    try {
      res = await this.props.login()
      if (res.error) {
        this.setState({ ...this.state, error: res.error })
        window.alert('error')
      } else {
        this.setState({ ...this.state, error: '' })
      }
    } catch (error) {
      console.log(error.message)
    }
  }


  render() {
    const errorMessage = this.state.error.length !== 0 ? <p className="Form-warning">{this.state.error}</p> : null;
    return (
      <>
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
          {errorMessage}
          <Button variant="contained" color="primary" type='submit'>Sign In</Button>
        </form>
      </>
    );
  }
}
