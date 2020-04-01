import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";

export default function PrivateRoute({ children, loggedIn, ...rest }) {
  console.log(rest)
  return (
    <Route

      render={({ location }) =>
        loggedIn === true ? (
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
