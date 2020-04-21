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
      positionState: "",
      guessesLeft: 0,
      isOver: false,
      winner: "",
      RS: auth.getUserInfo().id,
      RF: "",
      BS: "",
      BF: "",
      Host: "",
      secondsLeft: 60,
      turnId: ""
    }
    this.submitHint = this.submitHint.bind(this);
    this.ping = this.ping.bind(this);
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
    console.log('\n\nmatchState', matchState)

    this.setState({
      ...this.state,
      userId: auth.getUserInfo().id,
      matchId: matchId,
      words: matchState.info,
      positionState: matchState.state
    })

    setInterval(() => {
      if (!this.state.isOver && this.state.secondsLeft > 0) {
        this.setState({
          secondsLeft: --this.state.secondsLeft
        });
      }
    }, 1000);
  }

  isSpyTurn() {
    return !["RF", "BF"].includes(matchDictionary[this.state.positionState])
  }

  async ping() {
    let { matchId, userId, positionState, words, guessesLeft, isOver, secondsLeft, turnId } = this.state
    if (words.length === 0 || isOver) {
      return;
    }

    let res
    try {
      const reqBody = JSON.stringify({
        userID: userId,
        position: "_PING",
        move: "_PING",
        turnId: turnId
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
        this.props.setBlueScore(res.blueScore);
        this.props.setRedScore(res.redScore);

        this.setState({
          words,
          positionState: res.state,
          guessesLeft: Number(res.numGuess),
          message: "",
          RS: res.RS,
          RF: res.RF,
          BS: res.BS,
          BF: res.BF,
          Host: res.Host,
          isOver: res.isOver,
          winner: res.winner,
          secondsLeft: (turnId != res.turnId) ? 60 : secondsLeft,
          turnId: res.turnId
        })
      }
    } catch (error) {
      console.log('error @ PING .json() \n', error)
    }
  }

  clickWord = async (e) => {
    let { matchId, positionState, words, secondsLeft, turnId } = this.state
    if (this.isSpyTurn()) {
      return
    }

    try {
      let index = e.currentTarget.dataset.tag;

      const reqBody = JSON.stringify({
        userID: auth.getUserInfo().id,
        position: matchDictionary[positionState],
        move: index,
        turnId: turnId
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

        this.props.setBlueScore(res.blueScore);
        this.props.setRedScore(res.redScore);

        console.log('res state', res.info.state)
        this.setState({
          ...this.state,
          words,
          guessesLeft: Number(res.info.numGuess),
          positionState: res.info.state,
          message: "",
          isOver: res.isOver,
          winner: res.winner,
          secondsLeft: (turnId != res.turnId) ? 60 : secondsLeft,
          turnId: res.turnId
        });
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
        move: matchDictionary.end,
        turnId: this.state.turnId
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
        this.setState({ ...this.state, positionState, guessesLeft: 0, message: "", secondsLeft: 60, turnId: res.turnId });
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
      move: `${move.num} ${move.word}`,
      turnId: this.state.turnId
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
      this.setState({ ...this.state, positionState, guessesLeft: Number(res.numGuess), message: "", secondsLeft: 60, turnId: res.turnId });
    } catch (error) {
      console.log('error @ submitHint API')
    }
  }

  setUser = async (player, pos) => {

    /* if (pos=="RS") {
       if (this.state.RS==this.state.thisUser) {this.setState({RS: ""}); reqBody.userID = "";}
       else this.setState({RS: player});
     } else if (pos=="RF") {
       if (this.state.RF==this.state.thisUser) {this.setState({RF: ""}); reqBody.userID = "";}
       else this.setState({RF: player});
     } else if (pos=="BS") {
       if (this.state.BS==this.state.thisUser) {this.setState({BS: ""}); reqBody.userID = "";}
       else this.setState({BS: player});
     } else if (pos=="BF") {
       if (this.state.BF==this.state.thisUser) {this.setState({BF: ""}); reqBody.userID = "";}
       else this.setState({BF: player});
     }*/

    let newUser = auth.getUserInfo().id;
    let currPos = "";
    if (pos === "RS" && this.state.RS === this.state.userId) currPos = this.state.RS;
    else if (pos === "RF" && this.state.RF === this.state.userId) currPos = this.state.RF;
    else if (pos === "BS" && this.state.BS === this.state.userId) currPos = this.state.BS;
    else if (pos === "BF" && this.state.BF === this.state.userId) currPos = this.state.BF;

    const reqBody = JSON.stringify({
      userID: newUser,
      position: pos
    });
    try {
      if (currPos === "") {
        let res = await fetch(`/matches/${this.state.matchId}/joinmatch`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
          body: reqBody
        })
        res = await res.json();
        console.log("API setUser response", res);
        const info = res.info;
        this.setState({ RS: info.RS, RF: info.RF, BS: info.BS, BF: info.BF, Host: info.Host });
      } else if (currPos === this.state.userId) {
        let res = await fetch(`/matches/${this.state.matchId}/leavematch`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
          body: reqBody
        })
        res = await res.json();
        console.log("API setUser response", res);
        const info = res.info;
        this.setState({ RS: info.RS, RF: info.RF, BS: info.BS, BF: info.BF, Host: info.Host });
      }

    } catch (error) {
      console.log('error @joingame API');
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
    const { words, positionState, matchId, userId, guessesLeft, message, isOver, winner, secondsLeft } = this.state;
    document.body.style.overflow = "noscroll";
    return (<div className={classes.matchStyle}>
      <ChatBox
        submitHint={this.submitHint}
        matchID={matchId}
        userID={userId}
        position={matchDictionary[positionState]} />

      <Paper className={`${classes.paper} ${classes.centerText}`}>
        <Typography variant="h4">{positionState}</Typography>
        <ServerPing ping={this.ping} />
        {["RF", "BF"].includes(matchDictionary[positionState]) ? <p>{guessesLeft} guesses left</p> : null}
        {message !== "" ? <p>{message}</p> : null}
        <p style={{ fontFamily: "Roboto", fontSize: "20px" }}>Time remaining: {secondsLeft}</p>
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
