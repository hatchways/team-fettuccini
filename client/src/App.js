import React, { useEffects } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { theme } from "./themes/theme";

import NavBar from "./components/NavBar";

import Auth from "./components/auth";
import ProtectedRoutes from "./ProtectedRoutes";

import NewGame from "./components/protected/NewGame";


import "./App.css";

function App() {
  window.localStorage.removeItem('token')
  let loggedIn = window.localStorage.token
  console.log('window.localStorage', window.localStorage)
  // console.log('logged in? ', loggedIn)

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Auth} />
          <ProtectedRoutes exact path="/newgame" loggedIn={loggedIn} component={NewGame} />
        </Switch>

      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
