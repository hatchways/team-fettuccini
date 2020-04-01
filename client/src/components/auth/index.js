import React, { useState } from 'react'
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import Login from './Login'
import SignUp from './SignUp'

import dummyAuth from './dummyAuth'

import auth from './auth'

const landinPageStyle = theme => ({
  landingContainer: {
    margin: theme.spacing(2)
  }
});


function Auth() {
  // if (window.localStorage.token) {
  //   return <Redirect to='/newgame' />
  // }

  const [signIn, switchLogin] = useState(true)
  const text = signIn ? "Don't" : "Already"

  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };
  let login = () => {
    auth.authenticate(() => {
      history.replace(from);
    });
  };

  let loggedIn = window.localStorage.hasOwnPorperty('token') || false
  return (
    (loggedIn) ? <Redirect to="/newgame" />
      : (
        <div className='Form-container'>
          <button onClick={login}>Log in</button>
          {signIn ?
            <Login dummyAuth={dummyAuth} /> :
            <SignUp dummyAuth={dummyAuth} />}

          {text} have an account? &nbsp;
          <span className={`Form-switch ${signIn && 'Form-tab-selected'}`} onClick={() => switchLogin(!signIn)}>Sign In</span>
          <span className={`Form-switch ${!signIn && 'Form-tab-selected'}`} onClick={() => switchLogin(!signIn)}>Sign Up</span>
        </div>

      )
  )
}

export default withStyles(landinPageStyle)(Auth);
