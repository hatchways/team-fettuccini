import React, { useState } from 'react'
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import { Typography, Paper, Button } from "@material-ui/core";

import Login from './Login'
import SignUp from './SignUp'

import auth from './auth'

const landinPageStyle = theme => ({
  landingContainer: {
    margin: theme.spacing(2)
  }
});

function Auth(props) {
  const [signIn, switchLogin] = useState(props.hasOwnProperty('signIn') ? props.signIn : true)
  const text = signIn ? "Don't" : "Already"

  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };
  let login = () => {
    auth.authenticate(() => {
      history.replace(from);
    });
  };


  return (
    (auth.isAuthenticated()) ? <Redirect to="/waitingroom" />
      : (
        <Paper>
          <Typography variant="h4">{signIn ? "Sign In" : "Sign Up"}</Typography>
          {signIn ?
            <Login login={login} /> :
            <SignUp login={login} />}

          {text} have an account? &nbsp;
          <span className={`Form-switch ${signIn && 'Form-tab-selected'}`} onClick={() => switchLogin(!signIn)}>Sign In</span>
          <span className={`Form-switch ${!signIn && 'Form-tab-selected'}`} onClick={() => switchLogin(!signIn)}>Sign Up</span>
        </Paper>

      )
  )
}

export default withStyles(landinPageStyle)(Auth);
