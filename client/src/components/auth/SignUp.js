import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

const authStyle = theme => ({
  landingContainer: {
    margin: theme.spacing.unit * 2
  }
});

class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password1: '',
      password2: '',
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
    if (this.state.password1 !== this.state.password2) {
      error = "Passwords must match"
      this.setState({ ...this.state, error })
      return
    }

    window.alert('passed')
    this.setState({ ...this.state, error })
  }
  handleConfirmPassword(event) {
    let error = this.state.password1 !== event.target.value
      ? "Passwords must match"
      : '';

    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
      error
    })
  }

  render() {
    if (this.props.token) {
      return <Redirect to='/' />
    }

    const errorMessage = this.state.error.length !== 0 ? <p className="Form-warning">{this.state.error}</p> : null;

    return (
      <>
        <Typography className="Form-title">Sign up</Typography>
        <form onSubmit={this.handleSubmit}>
          <label for="name">Name:</label>
          <input
            className='Form-text-input'
            name="name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
            placeholder="Enter your Name"
            required />
          <label for="email">Email:</label>
          <input
            className='Form-text-input'
            name="email"
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
            placeholder="Enter your Email"
            required />
          <label for="email">Password:</label>
          <input
            className='Form-text-input'
            name="password1"
            type="password"
            minLength='6'
            value={this.state.password1}
            onChange={this.handleChange}
            placeholder="Enter Password"
            required />
          <label for="email">Confirm Password:</label>
          <input
            className='Form-text-input'
            name="password2"
            type="password"
            value={this.state.password2}
            onChange={this.handleConfirmPassword}
            placeholder="Enter Password Again" />
          {errorMessage}
          <button className='Form-submit' type='submit'>Sign Up</button>
        </form>
      </>
    );
  }
}
export default withStyles(authStyle)(SignUp);
