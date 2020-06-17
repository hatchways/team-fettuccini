import React from "react";
import { Redirect, Route } from "react-router-dom";

import auth from './components/auth/auth'

export default function PrivateRoute({ children, ...rest }) {
  return auth.isAuthenticated() ? (
    <Route {...rest}>{children}</Route>
  ) : (
      <Redirect
        to={{
          pathname: "/"
        }}
      />
    );
}
