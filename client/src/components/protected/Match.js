import React, { Component, Fragment } from "react";

import { Typography, Paper, Button, Grid } from "@material-ui/core";

import ChatBox from './ChatBox'
import MappedWords from './MappedWords'
import ServerPing from './ServerPing'

import auth from '../auth/auth'
import matchDictionary from './matchDictionary'

import { withStyles } from "@material-ui/styles";
import styleMatch from "./styleMatch";
import GameOutcome from "./GameOutcome";

const style = (theme) => ({
  centerText: {
    textAlign: "center",
    marginBottom: "0.5em",
  },
  leftText: {
    textAlign: "left",
  },
  gridContainer: {
    flexWrap: "wrap",
    justifyContent: "space-around",
    margin: "10px auto",
  },
  standardFlex: {
    display: "flex",
    flexWrap: "wrap",
  },
  standardFlexChild: {
    flexGrow: "1",
  },
});

class Match extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchId: '',
      userId: '',
      words: [],
      positionState: "",
      guessesLeft: 0,
      isOver: false,
      winner: "blue",
      blueScore: 5,
      redScore: 3,
    }
    this.submitHint = this.submitHint.bind(this)
    this.ping = this.ping.bind(this)
    this.isSpyTurn = this.isSpyTurn.bind(this)
  }

  componentDidMount = () => {
    if (
      this.props.location.state == null ||
      this.props.match.params.matchId !== this.props.location.state.matchId
    ) {
      this.props.history.push("/welcome");
    }
    const { matchId, matchState } = this.props.location.state
    console.log('\n\nmatchState', matchState)

    this.setState({
      ...this.state,
      matchId,
      words: matchState.info,
      userId: auth.getUserInfo().id,
      positionState: matchState.state
    })
  }

  testEndMatch = () => {
    let { isOver } = this.state;
    isOver = true;
    this.setState({ ...this.state, isOver });
  };

  isSpyTurn() {
    return !["RF", "BF"].includes(matchDictionary[this.state.positionState])
  }

  async ping() {
    if (this.state.words.length === 0) {
      return
    }

    let { matchId, userId, positionState, words, guessesLeft } = this.state
    let res
    try {
      const reqBody = JSON.stringify({
        userID: userId,
        position: "_PING",
        move: "_PING"
      })
      console.log('sending body', reqBody)
      console.log('matchId', matchId)
      res = await fetch(`/matches/${matchId}/nextmove`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
        body: reqBody
      })
      console.log('\n API PING raw', res)

      if (res.status !== 200) {
        let temp = await res.text()
        console.error('failed request :: ', temp)
      }
    } catch (error) {
      console.log('error @ PING raw', error)
    }

    try {
      res = await res.json()
      if (res.info === "") {
        this.props.history.push("/welcome")
      }
      console.log('\n API PING.json', res)

      let updateState = false

      for (let i = 0; i < words.length; i++) {
        if (words[i].slice(0, 2) !== res.info[i].slice(0, 2)) {
          updateState = true
          words[i] = res.info[i].slice(0, 2) + words[i]
        }
      }

      if (updateState || (res.state !== positionState) || (Number(res.numGuess) !== guessesLeft)) {
        this.setState({
          words,
          positionState: res.state,
          guessesLeft: Number(res.numGuess),
          message: ""
        })
      }
    } catch (error) {
      console.log('error @ PING .json() \n', error)
    }
  }

  clickWord = async (e) => {
    let { matchId, positionState, words } = this.state
    if (this.isSpyTurn()) {
      return
    }

    try {
      let index = e.currentTarget.dataset.tag;

      const reqBody = JSON.stringify({
        userID: auth.getUserInfo().id,
        position: matchDictionary[positionState],
        move: index
      })

      let res = await fetch(`/matches/${matchId}/nextmove`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
        body: reqBody
      })
      console.log('\n API clickWord first response', res)

      if (res.status === 200) {
        res = await res.json()
        console.log('\n API clickWord response', res)

        words[index] = res.info.info[index].slice(0, 2) + words[index]

        console.log('res state', res.info.state)
        this.setState({ ...this.state, words, guessesLeft: Number(res.info.numGuess), positionState: res.info.state, message: "" })

      }
    } catch (error) {
      console.log('error @ API /matches/:matchId/nextmove')
    }
  }

  endFieldTurn = async () => {
    if (this.isSpyTurn()) {
      return
    }
    try {
      const reqBody = JSON.stringify({
        userID: auth.getUserInfo().id,
        position: matchDictionary[this.state.positionState],
        move: matchDictionary.end
      })
      console.log('reqbody end turn', reqBody)

      let res = await fetch(`/matches/${this.state.matchId}/nextmove`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
        body: reqBody
      })
      res = await res.json()
      console.log('\n API endFieldTurn response', res)
      if (res.message === "Have to make at least one guess for a turn") {
        this.setState({ ...this.state, message: res.message })
      } else {
        let positionState = res.info.state
        this.setState({ ...this.state, positionState, guessesLeft: 0, message: "" })

      }
    } catch (error) {
      console.log('error @ API /matches/:matchId/nextmove to end turn')
    }
  }

  async submitHint(move) {
    console.log(move)
    const reqBody = JSON.stringify({
      userID: auth.getUserInfo().id,
      position: matchDictionary[this.state.positionState],
      move: `${move.num} ${move.word}`
    })

    try {
      let res = await fetch(`/matches/${this.state.matchId}/nextmove`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
        body: reqBody
      })
      res = await res.json()
      console.log('\n API submitHint response', res)

      let positionState = `${res.state}`

      console.log('\n positionState', positionState)
      this.setState({ ...this.state, positionState, guessesLeft: Number(res.numGuess), message: "" })
    } catch (error) {
      console.log('error @ submitHint API')
    }
  }

  render() {
    // console.log('local state', this.state)
    const { classes } = this.props;
    const { words, positionState, matchId, userId, guessesLeft, message, isOver, winner, blueScore, redScore } = this.state;
    return (<Fragment>
      <Grid container spacing={0} className={classes.gridContainer}>
        <Grid item xs={4}>
          <ChatBox
            submitHint={this.submitHint}
            matchID={matchId}
            userID={userId}
            position={matchDictionary[positionState]} />
        </Grid>
        <Grid item Container>
          <Paper className={`${classes.paper} ${classes.centerText}`}>
            <Typography variant="h4">{positionState}</Typography>
            <ServerPing ping={this.ping} />
            {["RF", "BF"].includes(matchDictionary[positionState]) ? <p>{guessesLeft} guesses left</p> : null}
            {message !== "" ? <p>{message}</p> : null}
            <Grid container item xs={12} className={classes.standardFlex}>
              <MappedWords classes={classes} words={words} clickWord={this.clickWord} />
            </Grid>
            <Button variant="outlined" onClick={this.endFieldTurn}>End Turn</Button>
          </Paper>
        </Grid>
      </Grid>
        <GameOutcome
          isOver={isOver}
          winner={winner}
          blueScore={blueScore}
          redScore={redScore}
        />
        <button onClick={this.testEndMatch}>End match (for testing)</button>
    </Fragment>)
  }
}

export default withStyles(styleMatch)(Match)
