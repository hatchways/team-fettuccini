import React, { useState } from 'react'
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

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
    (auth.isAuthenticated()) ? <Redirect to="/newgame" />
      : (
        <div className='container'>
          <button onClick={login}>Log in</button>
          {signIn ?
            <Login login={login} /> :
            <SignUp login={login} />}

          {text} have an account? &nbsp;
          <span className={`Form-switch ${signIn && 'Form-tab-selected'}`} onClick={() => switchLogin(!signIn)}>Sign In</span>
          <span className={`Form-switch ${!signIn && 'Form-tab-selected'}`} onClick={() => switchLogin(!signIn)}>Sign Up</span>
        </div>

      )
  )
}

export default withStyles(landinPageStyle)(Auth);
