import React, { useState } from 'react'
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import Login from './Login'
import SignUp from './SignUp'

import dummyAuth from './dummyAuth'

const landinPageStyle = theme => ({
  landingContainer: {
    margin: theme.spacing(2)
  }
});


function Auth() {
  const [login, switchLogin] = useState(true)
  const text = login ? "Don't" : "Already"

  if (window.localStorage.token) {
    return <Redirect to='/newgame' />
  }

  return (
    <div className='Form-container'>
      {login ?
        <Login dummyAuth={dummyAuth} /> :
        <SignUp dummyAuth={dummyAuth} />}

      {text} have an account? &nbsp;
          <span className={`Form-switch ${login && 'Form-tab-selected'}`} onClick={() => switchLogin(!login)}>Sign In</span>
      <span className={`Form-switch ${!login && 'Form-tab-selected'}`} onClick={() => switchLogin(!login)}>Sign Up</span>
    </div>

  )
}

export default withStyles(landinPageStyle)(Auth);
