import React, { useEffects } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { theme } from "./themes/theme";

import NavBar from "./components/NavBar";

import Auth from "./components/auth";
import auth from "./components/auth/auth";
import ProtectedRoute from "./ProtectedRoute";

import NewGame from "./components/protected/NewGame";


import "./App.css";

function App() {

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Auth} />
          <ProtectedRoute exact path="/newgame">
            <NewGame />
          </ProtectedRoute>
          {/* <ProtectedRoute exact path="/newgame"  component={NewGame} /> */}
        </Switch>

      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
