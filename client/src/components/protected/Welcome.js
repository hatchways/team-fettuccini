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
      errorMess: ""
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

  joinRandom = async () => {
    let res
    try {
      // API call to create new game
      res = await fetchUtil({
        url: '/matches/joinrandom',
        method: "GET"
      })
    } catch (error) {
      console.log('failed to create new game', error)
    }

    console.log(res)

    if (res.hasOwnProperty('matchID')) {
      this.props.history.push({
        pathname: `/waitingroom/${res.matchID}`
      })
    } else {
      window.alert(res.message)
    }
  }

  newGame = async (e) => {

    let matchId
    let res

    try {
      res = await fetchUtil({
        url: '/matches/creatematch',
        method: "POST",
        body: {
          hostID: auth.getUserInfo().id,
          isPublic: e.currentTarget.dataset.id
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
            <FormLabel className={classes.centerText}>Or</FormLabel>
            <Button variant="contained" className={classes.darkGray} onClick={this.joinRandom}>Join Random</Button>
          </Grid>
          <Grid item className={classes.borderLeft}>
            <form className={classes.flexCol}>
              <FormLabel className={classes.centerText}>New Game:</FormLabel>
              <Button variant="outlined" data-id="true" onClick={this.newGame}>Public</Button>
              <Button variant="outlined" data-id="false" onClick={this.newGame}>Private</Button>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Fragment >)
  }
}

export default withStyles(style)(Welcome)
