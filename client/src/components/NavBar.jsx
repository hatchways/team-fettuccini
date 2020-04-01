import React from "react";
import { useHistory } from "react-router-dom";

import auth from './auth/auth'

export default function () {
  let history = useHistory();

  return <div className="header">
    <h1>
      CODINGWORDS
    </h1>
    {auth.isAuthenticated ? <button
      onClick={() => {
        auth.signout(() => history.push("/"));
      }}
    >
      Sign out
      </button> : null}
  </div>
}
