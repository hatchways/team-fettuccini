import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { theme } from "./themes/theme";
import Auth from "./components/auth";
import NavBar from "./components/NavBar";


import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <>
          <NavBar />
          <Switch>
            <Route path="/" component={Auth} />
          </Switch>
        </>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
