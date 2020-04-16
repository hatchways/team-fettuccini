import React, { Component, Fragment } from "react";
import { InputBase, Typography, Paper, Button, FormLabel, Grid } from "@material-ui/core";

import auth from '../auth/auth'

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
    let { matchId } = this.state
    if (matchId !== "") {
      this.props.history.push({
        pathname: `/waitingroom/${matchId}`
      })
    }
  }

  newGame = async () => {

    let matchId
    let res
    let hostID = auth.getUserInfo().id
    let reqBody = JSON.stringify({ hostID })

    try {
      // API call to create new game
      res = await fetch('/matches/creatematch', {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
        body: reqBody
      })
      res = await res.json()
      matchId = res.matchID
      this.props.history.push({
        pathname: `/waitingroom/${matchId}`
      })
    } catch (error) {
      console.log('failed to create new game', error)
    }

  }

  render() {
    const { classes } = this.props
    return (<Fragment>
      <Paper className="MuiPaper-customPrimary">
        <Typography variant="h4">Welcome {auth.getUserInfo().username}</Typography>
        <Grid container className={classes.gridContainer}>
          <Grid item>
            <form onSubmit={this.handleSubmit}>
              <FormLabel className={classes.centerMobile} htmlFor="matchId">Join a Game:</FormLabel>
              <div className={classes.outlined}>
                <InputBase
                  name="matchId"
                  id="matchId"
                  type="text"
                  value={this.state.matchId}
                  onChange={this.handleChange}
                  placeholder="Enter Game ID"
                  required
                  inputProps={{ 'aria-label': 'naked' }}
                />
                <Button variant="contained" className={classes.darkGray} type="submit">Join Game</Button>
              </div>
            </form>
          </Grid>
          <Grid item className={classes.borderLeft}>
            <FormLabel className={classes.centerText}>Create a Game:</FormLabel>
            <Button variant="outlined" onClick={this.newGame}>New Game</Button>
          </Grid>
        </Grid>
      </Paper>
    </Fragment>)
  }
}

export default withStyles(style)(Welcome)
