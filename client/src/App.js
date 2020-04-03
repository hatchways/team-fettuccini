import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import NavBar from "./components/NavBar";
import Auth from "./components/auth";
import ProtectedRoute from "./ProtectedRoute";
import NewGame from "./components/protected/NewGame";

import { theme } from "./themes/theme";
import "./App.css";

function App() {
  console.log('app\n\n')

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/signin" render={(props) => <Auth {...props} signIn={true} />} />
          <Route exact path="/signup" render={(props) => <Auth {...props} signIn={false} />} />
          <ProtectedRoute exact path="/newgame" component={NewGame} />
          <Route path="/" component={Auth} />
        </Switch>

      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
