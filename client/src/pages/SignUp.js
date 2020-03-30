import React, { Component } from "react";

import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Route, Link } from "react-router-dom";

import Ping from "./Ping";
import Header from "./Header";

const landinPageStyle = theme => ({
  landingContainer: {
    margin: theme.spacing.unit * 2
  }
});

class SignUp extends Component {
  state = {
    welcomeMessage: "Step 1: Run the server and refresh (not running)",
    step: 0
  };

  componentDidMount() {

  }

  incrementStep = () => {
    this.setState(prevState => ({ step: (prevState.step += 1) }));
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.landingContainer}>
        <Header />
        <Typography>{this.state.welcomeMessage}</Typography>

      </div>
    );
  }
}

export default withStyles(landinPageStyle)(SignUp);
