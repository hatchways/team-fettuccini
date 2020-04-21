import React, { Component, Fragment } from "react";
import { InputBase, Typography, Paper, Button, FormLabel, Grid, Checkbox, FormControlLabel } from "@material-ui/core";

import auth from '../auth/auth'
import fetchUtil from './fetchUtil'

import { withStyles } from "@material-ui/styles";

import style from "./styleWaitingNewGame"

class Welcome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      matchId: '',
      isPrivate: false
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

  handlePrivate = (e) => {
    this.setState((prevState) => ({ ...prevState, isPrivate: !prevState.isPrivate }))
  }

  newGame = async () => {

    let matchId
    let res
    const { isPrivate } = this.state

    try {
      // API call to create new game
      res = await fetchUtil({
        url: '/matches/creatematch',
        method: "POST",
        body: {
          hostID: auth.getUserInfo().id,
          isPrivate
        }
      })
    } catch (error) {
      console.log('failed to create new game', error)
    }

    console.log('res form welcome ', res)
    matchId = res.matchID
    this.props.history.push({
      pathname: `/waitingroom/${matchId}`
    })
  }

  render() {
    const { classes } = this.props
    const { isPrivate } = this.state

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
            <form className={classes.flexCol}>
              <FormLabel className={classes.centerText}>Create a Game:</FormLabel>
              <Button variant="outlined" onClick={this.newGame}>New Game</Button>
              <FormControlLabel className={classes.removeMarginRight}
                control={<Checkbox onChange={this.handlePrivate} name="isPrivate" value={isPrivate} />}
                label="Private"
              />
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Fragment >)
  }
}

export default withStyles(style)(Welcome)
