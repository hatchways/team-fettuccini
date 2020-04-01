import React, { Component } from "react";
import { Typography, FormLabel, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const authStyle = theme => ({
  landingContainer: {
    margin: theme.spacing(2)
  }
});

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

    let res
    try {
      res = await this.props.login()
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
        <Typography className="Form-title">Sign up</Typography>
        <form onSubmit={this.handleSubmit}>
          <FormLabel htmlFor="name">Name:</FormLabel>
          <TextField
            variant="outlined"
            className='Form-text-input'
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
            className='Form-text-input'
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
            className='Form-text-input'
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
            className='Form-text-input'
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            value={this.state.passwordConfirm}
            onChange={this.handleConfirmPassword}
            placeholder="Enter Password Again" />
          {errorMessage}
          <button className='Form-submit' type='submit'>Sign Up</button>
        </form>
      </>
    );
  }
}
// export default withStyles(authStyle)(SignUp);
