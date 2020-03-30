import React, { Component } from 'react'
import Login from './Login'
import SignUp from './SignUp'

import { withStyles } from "@material-ui/core/styles";

const landinPageStyle = theme => ({
  landingContainer: {
    margin: theme.spacing.unit * 2
  }
});

class Auth extends Component {
  constructor(props) {
    super()
    this.state = {
      login: true
    }
  }

  render() {
    const text = this.state.login ? "Don't" : "Already"
    return (
      <div className='Form-container'>
        {this.state.login ?
          <Login /> :
          <SignUp />}

        {text} have an account? &nbsp;
          <span className={`Form-switch ${this.state.login && 'Form-tab-selected'}`} onClick={() => this.setState({ login: true })}>Log In</span>
        <span className={`Form-switch ${!this.state.login && 'Form-tab-selected'}`} onClick={() => this.setState({ login: false })}>Sign Up</span>
      </div>

    )
  }
}

export default withStyles(landinPageStyle)(Auth);
