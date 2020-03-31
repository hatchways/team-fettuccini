import React, { useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'

import { withStyles } from "@material-ui/core/styles";

const landinPageStyle = theme => ({
  landingContainer: {
    margin: theme.spacing.unit * 2
  }
});


function Auth() {
  const [login, switchLogin] = useState(true)
  const text = login ? "Don't" : "Already"

  return (
    <div className='Form-container'>
      {login ?
        <Login /> :
        <SignUp />}

      {text} have an account? &nbsp;
          <span className={`Form-switch ${login && 'Form-tab-selected'}`} onClick={() => switchLogin(!login)}>Sign In</span>
      <span className={`Form-switch ${!login && 'Form-tab-selected'}`} onClick={() => switchLogin(!login)}>Sign Up</span>
    </div>

  )
}

export default withStyles(landinPageStyle)(Auth);
