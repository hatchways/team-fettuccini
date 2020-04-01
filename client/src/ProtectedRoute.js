import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";

import auth from './components/auth/auth'

export default function PrivateRoute({ children, ...rest }) {

  console.log(rest)
  return (
    <Route

      render={({ location }) =>
        auth.isAuthenticated() ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}
