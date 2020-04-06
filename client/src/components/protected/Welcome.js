import React, { Component, Fragment } from "react";
import { Typography, Paper, Button, FormLabel, TextField, Grid } from "@material-ui/core";

import { withStyles } from "@material-ui/styles";

import style from "./styleWaitingNewGame"

class Welcome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      matchId: ''
    }
  }

  handleChange = (e) => {
    this.setState({ ...this.state, [e.target.name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.matchId !== "") {

    }
  }

  newGame = async () => {
    const matchId = Math.floor(Math.random() * 100).toString()
    try {
      // API call to create new game

    } catch (error) {
      console.log('failed to create new game', error)
    }

    this.props.history.push({
      pathname: `/waitingroom/${matchId}`,
      state: { matchId }
    })
  }

  render() {
    const { classes } = this.props
    return (<Fragment>
      <Paper>
        <Typography variant="h4">Welcome Spy</Typography>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item>
            <form onSubmit={this.handleSubmit}>
              <FormLabel htmlFor="matchId">Join a Game:</FormLabel>
              <div className={classes.standardFlex}>
                <TextField
                  variant="outlined"
                  className={classes.standardFlexChild}
                  name="matchId"
                  id="matchId"
                  type="text"
                  value={this.state.matchId}
                  onChange={this.handleChange}
                  placeholder="Enter Game ID"
                  required />
                <Button variant="contained" type="submit" className={classes.standardFlexChild}>Join Game</Button>
              </div>
            </form>
          </Grid>
          <Grid item>
            <FormLabel className={classes.centerText}>Create a Game:</FormLabel>
            <Button variant="outlined" onClick={this.newGame}>New Game</Button>
          </Grid>
        </Grid>
      </Paper>
    </Fragment>)
  }
}

export default withStyles(style)(Welcome)
