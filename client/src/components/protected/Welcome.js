import React, { useState, Fragment } from "react";
import { InputBase, Typography, Paper, Button, FormLabel, Grid, Checkbox, FormControlLabel } from "@material-ui/core";

import auth from '../auth/auth'
import fetchUtil from './fetchUtil'

import { withStyles } from "@material-ui/styles";

import style from "./styleWaitingNewGame"

function Welcome(props) {
  
   const [ state, setState ] = useState({
      matchId: '',
      errorMess: ""
    });

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let { matchId } = state
    if (matchId !== "") {
      props.history.push({
        pathname: `/waitingroom/${matchId}`
      })
    }
  }

  const joinRandom = async () => {
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
      props.history.push({
        pathname: `/waitingroom/${res.matchID}`
      })
    } else {
      window.alert(res.message)
    }
  }

  const newGame = async (e) => {

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
    props.history.push({
      pathname: `/waitingroom/${matchId}`
    })
  }

    const { classes } = props

    return (<Fragment>
      <Paper className="MuiPaper-customPrimary">
        <Typography variant="h4">Welcome {auth.getUserInfo().username}</Typography>
        <Grid container className={classes.gridContainer}>
          <Grid item>
            <form onSubmit={handleSubmit}>
              <FormLabel className={classes.centerMobile} htmlFor="matchId">Join a Game:</FormLabel>
              <div className={classes.outlined}>
                <InputBase
                  name="matchId"
                  id="matchId"
                  type="text"
                  value={state.matchId}
                  onChange={handleChange}
                  placeholder="Enter Game ID"
                  required
                  inputProps={{ 'aria-label': 'naked' }}
                />
                <Button variant="contained" className={classes.darkGray} type="submit">Join Game</Button>
              </div>
            </form>
            <FormLabel className={classes.centerText}>Or</FormLabel>
            <Button variant="contained" className={classes.darkGray} onClick={joinRandom}>Join Random</Button>
          </Grid>
          <Grid item className={classes.borderLeft}>
            <form className={classes.flexCol}>
              <FormLabel className={classes.centerText}>New Game:</FormLabel>
              <Button variant="outlined" data-id="true" onClick={newGame}>Public</Button>
              <Button variant="outlined" data-id="false" onClick={newGame}>Private</Button>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Fragment >)
}

export default withStyles(style)(Welcome)
