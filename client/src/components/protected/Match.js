import React, { Component } from "react";

import { Typography, Paper, Button, Grid } from "@material-ui/core";

import ChatBox from './ChatBox'
import MappedWords from './MappedWords'
import ServerPing from './ServerPing'

import auth from '../auth/auth'
import matchDictionary from './matchDictionary'

import { withStyles } from "@material-ui/styles";
import styleMatch from "./styleMatch";
import GameOutcome from "./GameOutcome";

import fetchUtil from './fetchUtil'

class Match extends Component {
  constructor(props) {
    super(props);

    this.props.setIsMatchInProgres(true);
    this.props.setBlueScore(0);
    this.props.setRedScore(0);

    this.state = {
      matchId: '',
      userId: auth.getUserInfo().id,
      words: [],
      chatHistory: [],
      positionState: "",
      guessesLeft: 0,
      isOver: false,
      winner: "blue",
      roles: {
        RS: "",
        RF: "",
        BS: "",
        BF: "",
      },
      Host: ""
    }
    this.submitHint = this.submitHint.bind(this);
    this.ping = this.ping.bind(this);
    this.isMyTurn = this.isMyTurn.bind(this);
    this.isSpyTurn = this.isSpyTurn.bind(this);
  }

  componentDidMount = () => {
    if (
      this.props.location.state == null ||
      this.props.match.params.matchId !== this.props.location.state.matchId
    ) {
      this.props.history.push("/welcome");
    }
    const { matchId, matchState } = this.props.location.state

    this.setState({
      ...this.state,
      userId: auth.getUserInfo().id,
      matchId: matchId,
      words: matchState.info,
      positionState: matchState.state
    })
  }

  isMyTurn() {
    return this.state.roles[matchDictionary[this.state.positionState]] === this.state.userId
  }
  isSpyTurn() {
    return ["RS", "BS"].includes(matchDictionary[this.state.positionState])
  }

  async ping() {
    if (this.state.words.length === 0) {
      return
    }

    let { matchId, userId, positionState, words, guessesLeft, roles, chatHistory } = this.state
    let res

    try {
      res = await fetchUtil({
        url: `/matches/${matchId}/nextmove`,
        method: "POST",
        body: {
          userID: userId,
          position: "_PING",
          move: "_PING"
        }
      })
    } catch (error) {
      console.log('error @ PING .json() \n', error)
    }

    if (res.info === "") {
      this.props.history.push("/welcome")
    }

    console.log('\n API PING.json', res)

    let updateState = (res.state !== positionState) || (Number(res.numGuess) !== guessesLeft) || chatHistory.length !== res.chatHistory.length

    Object.keys(roles).forEach(role => {
      if (roles[role] !== res[role]) {
        updateState = true
      }
    })

    for (let i = 0; i < words.length; i++) {
      if (words[i].slice(0, 2) !== res.info[i].slice(0, 2)) {
        updateState = true
        words[i] = res.info[i].slice(0, 2) + words[i]
      }
    }

    if (updateState) {
      this.setState({
        ...this.state,
        words,
        positionState: res.state,
        guessesLeft: Number(res.numGuess),
        message: "",
        roles: {
          RS: res.RS,
          RF: res.RF,
          BS: res.BS,
          BF: res.BF,
        },
        Host: res.Host,
        chatHistory: res.chatHistory
      })
    }

  }

  clickWord = async (e) => {
    let { matchId, positionState, words } = this.state
    if (!this.isMyTurn() || this.isSpyTurn()) {
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

      if (res.status === 200) {
        res = await res.json()

        words[index] = res.info.info[index].slice(0, 2) + words[index]

        this.setState({ ...this.state, words, guessesLeft: Number(res.info.numGuess), positionState: res.info.state, message: "" })

      }
    } catch (error) {
      console.log('error @ API /matches/:matchId/nextmove')
    }
  }

  endFieldTurn = async () => {
    if (!this.isMyTurn()) {
      return
    }
    try {
      const reqBody = JSON.stringify({
        userID: auth.getUserInfo().id,
        position: matchDictionary[this.state.positionState],
        move: matchDictionary.end
      })

      let res = await fetch(`/matches/${this.state.matchId}/nextmove`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
        body: reqBody
      })
      res = await res.json()

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

      let positionState = `${res.state}`

      this.setState({ ...this.state, positionState, guessesLeft: Number(res.numGuess), message: "" })
    } catch (error) {
      console.log('error @ submitHint API')
    }
  }

  render() {
    console.log('local state', this.state)
    const {
      classes,
      setIsMatchInProgres,
      blueScore,
      redScore
    } = this.props;

    const { words, positionState, chatHistory, guessesLeft, message, isOver, winner } = this.state;

    document.body.style.overflow = "noscroll";

    return (<div className={classes.matchStyle}>
      <ChatBox
        isMyTurn={this.isMyTurn}
        isSpyTurn={this.isSpyTurn}
        submitHint={this.submitHint}
        chatHistory={chatHistory}
      />

      <Paper className={`${classes.paper} ${classes.centerText}`}>
        <Typography variant="h4">
          {positionState} &nbsp;
      {this.isMyTurn() ? "(You)" : null}
        </Typography>
        <ServerPing ping={this.ping} />
        <p>{["RF", "BF"].includes(matchDictionary[positionState]) ? `${guessesLeft} guesses left` : null}</p>
        {message !== "" ? <p>{message}</p> : null}
        <Grid container item xs={12} className={classes.standardFlex}>
          <MappedWords classes={classes} words={words} clickWord={this.clickWord} />
        </Grid>
        <Button variant="contained" color="primary" onClick={this.endFieldTurn}>End Turn</Button>
      </Paper>
      {isOver ? (
        <GameOutcome
          isOver={isOver}
          setIsMatchInProgres={setIsMatchInProgres}
          winner={winner}
          blueScore={blueScore}
          redScore={redScore}
        />
      ) : null}
    </div>)
  }
}

export default withStyles(styleMatch)(Match)
