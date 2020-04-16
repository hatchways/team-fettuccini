import React, { useState } from 'react'
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import { Typography, Paper } from "@material-ui/core";

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
  let login = (user) => {
    auth.authenticate(user, (() => {
      history.replace(from);
    }));
  };


  return (
    (auth.isAuthenticated()) ? <Redirect to="/welcome" />
      : (
        <Paper className="MuiPaper-customPrimary">
          <Typography variant="h4">{signIn ? "Sign In" : "Sign Up"}</Typography>
          {signIn ?
            <Login login={login} /> :
            <SignUp login={login} />}

          <Typography variant="body1">{text} have an account? &nbsp;</Typography>

          {signIn
            ? <Typography variant="h6" onClick={() => switchLogin(!signIn)}>Sign Up</Typography>
            : <Typography variant="h6" onClick={() => switchLogin(!signIn)}>Sign In</Typography>}
        </Paper>

      )
  )
}

export default withStyles(landinPageStyle)(Auth);
