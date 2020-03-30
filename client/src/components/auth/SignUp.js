import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import { Route, Link, Redirect } from "react-router-dom";
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
    await this.props.login(
      {
        email: this.state.email,
        password: this.state.password
      }
    )
    const { id, token } = this.props
    if (token) {
      await this.props.getTransactions(id, token)
      this.props.getPortfolio(id, token)
    } else {
      alert('Invalid credentials, please try again')
    }
  }

  render() {
    if (this.props.token) {
      return <Redirect to='/' />
    }
    return (
      <>
        <Typography className="Form-title">Sign up</Typography>
        <form onSubmit={this.handleSubmit}>
          <input
            className='Form-text-input'
            name="name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
            placeholder="Enter Name" />
          <input
            className='Form-text-input'
            name="email"
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
            placeholder="Enter Email" />
          <input
            className='Form-text-input'
            name="password1"
            type="password"
            value={this.state.password1}
            onChange={this.handleChange}
            placeholder="Enter Password" />
          <input
            className='Form-text-input'
            name="password2"
            type="password"
            value={this.state.password2}
            onChange={this.handleChange}
            placeholder="Enter Password Again" />
          <button className='Form-submit' type='submit'>Sign Up</button>
        </form>
      </>
    );
  }
}
export default withStyles(authStyle)(SignUp);
