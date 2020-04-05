import React, { Component, Fragment } from "react";
import { Typography, Paper, Button, FormLabel, TextField, Grid } from "@material-ui/core";

import { withStyles } from "@material-ui/styles";

import style from "./styleWaitingNewGame"

class WaitingRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gameId: ''
    }
  }

  handleChange = (e) => {
    this.setState({ ...this.state, [e.target.name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.gameId !== "") {

    }
  }

  render() {
    const { classes } = this.props
    return (<Fragment>
      <Paper>
        <Typography variant="h4">Welcome Spy</Typography>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item>
            <form onSubmit={this.handleSubmit}>
              <FormLabel htmlFor="gameId">Join a Game:</FormLabel>
              <div className={classes.standardFlex}>
                <TextField
                  variant="outlined"
                  className={classes.standardFlexChild}
                  name="gameId"
                  id="gameId"
                  type="text"
                  value={this.state.gameId}
                  onChange={this.handleChange}
                  placeholder="Enter Game ID"
                  required />
                <Button variant="contained" type="submit" className={classes.standardFlexChild}>Join Game</Button>
              </div>
            </form>
          </Grid>
          <Grid item>
            <FormLabel className={classes.centerText}>Create a Game:</FormLabel>
            <Button variant="outlined" onClick={() => this.props.history.push("/newgame")}>New Game</Button>
          </Grid>
        </Grid>
      </Paper>
    </Fragment>)
  }
}

export default withStyles(style)(WaitingRoom)
