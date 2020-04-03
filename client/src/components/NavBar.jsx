import React from "react";
import { useHistory } from "react-router-dom";
import { Typography, Button } from "@material-ui/core";

import auth from './auth/auth'

export default function () {
  let history = useHistory();

  return <div className="header">
    <Typography variant="h2">
      CODINGWORDS
    </Typography>
    {auth.isAuthenticated() ? <Button
      variant="contained"
      color="primary"
      onClick={() => {
        auth.signout(() => history.push("/"));
      }}
    >
      Sign out
      </Button> : null}
  </div>
}
