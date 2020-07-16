import React, { useState } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import NavBar from "./components/NavBar";
import Auth from "./components/auth";

import ProtectedRoute from "./ProtectedRoute";
import WaitingRoom from "./components/protected/WaitingRoom";
import Welcome from "./components/protected/Welcome";
import Match from "./components/protected/Match";
import Profile from "./components/protected/Profile";
import MatchHistory from "./components/protected/MatchHistory";
import { theme } from "./themes/theme";
import "./index.css";
function App() {
  const [isMatchInProgres, setIsMatchInProgres] = useState(false);
  const [blueScore, setBlueScore] = useState(0);
  const [redScore, setRedScore] = useState(0);

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <NavBar
          isMatchInProgres={isMatchInProgres}
          setIsMatchInProgres={setIsMatchInProgres}
          blueScore={blueScore}
          redScore={redScore}
        />
        <Switch>
          <Route exact path="/signin" render={(props) => <Auth {...props} signIn={true} />} />
          <Route exact path="/signup" render={(props) => <Auth {...props} signIn={false} />} />
          <ProtectedRoute exact path="/welcome" component={Welcome} />
          <ProtectedRoute exact path="/waitingroom/:matchId" component={WaitingRoom} />
          <ProtectedRoute exact path="/profile" component={Profile}/>
          <ProtectedRoute
            exact
            path="/match/:matchId"
            render={(props) => (
              <Match
                {...props}
                isMatchInProgres={isMatchInProgres}
                setIsMatchInProgres={setIsMatchInProgres}
                blueScore={blueScore}
                setBlueScore={setBlueScore}
                redScore={redScore}
                setRedScore={setRedScore}
              />
            )}
          />
          <ProtectedRoute 
          	exact 
          	path="/profile/matchhistory"
          	component={MatchHistory}
          	render={
        		(props) => (
        			<MatchHistory 
        				{...props}
        			/>
        		)  
            }
          />
          <Route path="/" component={Auth} />
        </Switch>

      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
