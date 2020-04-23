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
      isOver: false,
      matchId: '',
      myRole: '',
      userId: '',
      positionState: "",
      winner: "",
      Host: "",
      guessesLeft: 0,
      words: [],
      chatHistory: [],
      roles: {},
    }
    this.submitHint = this.submitHint.bind(this);
    this.ping = this.ping.bind(this);
    this.isMyTurn = this.isMyTurn.bind(this);
    this.amISpy = this.amISpy.bind(this);
  }

  componentDidMount = () => {
    if (this.props.location.state == null) {
      this.props.history.push(`/waitingroom/${this.props.match.params.matchId}`);
    } else {
      const { matchId, matchState, positions } = this.props.location.state

      this.setState({
        ...this.state,
        userId: auth.getUserInfo().id,
        matchId: matchId,
        words: matchState.info,
        positionState: matchState.state,
        roles: { ...positions },
      })
    }
  }

  isMyTurn() {
    if (!this.state.roles.hasOwnProperty(this.state.myRole)) {
      return false
    }

    return matchDictionary[this.state.positionState] === this.state.myRole
  }
  amISpy() {
    return ["RS", "BS"].includes(this.state.myRole)
  }

  async ping() {
    if (this.state.words.length === 0) {
      return
    }

    let { matchId, userId, positionState, words, guessesLeft, roles, myRole, chatHistory } = this.state
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

    let updateState = (res.state !== positionState)
      || (Number(res.numGuess) !== guessesLeft)
      || chatHistory.length !== res.chatHistory.length

    Object.keys(roles).forEach(role => {
      if (userId === res[role].id) {
        myRole = role
      }

      if (!roles.hasOwnProperty(role)) {
        roles[role] = {
          name: res[role].name,
          id: res[role].id
        }
      } else if (roles[role].id !== res[role].id) {
        roles[role] = {
          name: res[role].name,
          id: res[role].id
        }
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
        roles,
        myRole,
        Host: res.Host,
        chatHistory: res.chatHistory
      })
    }
  }

  clickWord = async (e) => {
    if (!this.isMyTurn() || this.amISpy()) {
      return
    } else {
      let { matchId, positionState, words, userId, myRole } = this.state
      let index = e.currentTarget.dataset.tag
      let res

      try {
        res = await fetchUtil({
          url: `/matches/${matchId}/nextmove`,
          method: "POST",
          body: {
            userID: userId,
            position: myRole,
            move: index
          }
        })
      } catch (error) {
        console.log('error @ API /matches/:matchId/nextmove')
      }

      words[index] = res.info.info[index] !== words[index] ? res.info.info[index].slice(0, 2) + words[index] : words[index]

      this.setState({ ...this.state, words, guessesLeft: Number(res.info.numGuess), positionState: res.info.state, message: "" })
    }
  }

  endFieldTurn = async () => {
    if (!this.isMyTurn() || this.amISpy()) {
      return
    }
    const { myRole } = this.state

    let res

    try {
      res = await fetchUtil({
        url: `/matches/${this.state.matchId}/nextmove`,
        method: "POST",
        body: {
          userID: this.state.userId,
          position: myRole,
          move: matchDictionary.end
        }
      })

    } catch (error) {
      console.log('error @ API /matches/:matchId/nextmove to end turn')
    }

    if (res.message === "Have to make at least one guess for a turn") {
      this.setState({ ...this.state, message: res.message })
    } else {
      let positionState = res.info.state
      this.setState({ ...this.state, positionState, guessesLeft: 0, message: "" })
    }
  }

  async submitHint(move) {

    const { myRole } = this.state


    let res, reqMove, reqPosition

    if (this.amISpy()) {
      if (this.isMyTurn()) {
        reqMove = `${move.num} ${move.word}`
        reqPosition = myRole
      } else {
        return
      }
    } else if (!this.amISpy()) {
      reqMove = move.word
      reqPosition = "_CHAT"
    }

    try {
      res = await fetchUtil({
        url: `/matches/${this.state.matchId}/nextmove`,
        method: "POST",
        body: {
          userID: this.state.userId,
          position: reqPosition,
          move: reqMove,
          name: auth.getUserInfo().name,
          role: myRole
        }
      })

    } catch (error) {
      console.log('error @ submitHint API')
    }

    let positionState = res.state

    this.setState({ ...this.state, positionState, guessesLeft: Number(res.numGuess), message: "" })
  }

  render() {
    console.log('local state', this.state)
    const {
      classes,
      setIsMatchInProgres,
      blueScore,
      redScore
    } = this.props;

    const { words, positionState, chatHistory, guessesLeft, myRole, message, isOver, winner } = this.state;

    document.body.style.overflow = "noscroll";

    return (<div className={classes.matchStyle}>
      <ChatBox
        submitHint={this.submitHint}
        chatHistory={chatHistory}
      />

      <Paper className={`${classes.paper} ${classes.centerText}`}>
        <Typography variant="h4">
          {positionState} &nbsp;
      {this.isMyTurn() ? "(You)" : null}
        </Typography>
        <ServerPing ping={this.ping} />
        <p>{["RF", "BF"].includes(matchDictionary[positionState]) ? `${guessesLeft} guesses left` : <>&nbsp;</>}</p>
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
