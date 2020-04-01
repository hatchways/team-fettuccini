import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import NavBar from "./components/NavBar";
import Auth from "./components/auth";
import ProtectedRoute from "./ProtectedRoute";
import NewGame from "./components/protected/newGame";

import { theme } from "./themes/theme";
import "./App.css";

function App() {

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Auth} />
          <ProtectedRoute exact path="/newgame" component={NewGame} />
        </Switch>

      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
