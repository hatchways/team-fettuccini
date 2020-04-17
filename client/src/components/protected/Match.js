import React, { Component, Fragment } from "react";

import { Typography, Paper, Button, Grid } from "@material-ui/core";

import ChatBox from './ChatBox'
import UserDisplay from './UserDisplay'
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
      winner: "blue",
      RS: auth.getUserInfo().id,
      RF: "",
      BS: "",
      BF: "",
      Host: ""
    }
    this.submitHint = this.submitHint.bind(this);
    this.ping = this.ping.bind(this);
    this.isSpyTurn = this.isSpyTurn.bind(this);
    this.userDisplay = React.createRef();
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
  }

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
          message: "",
          words,
          RS: res.RS,
          RF: res.RF,
          BS: res.BS,
          BF: res.BF,
          Host: res.Host
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
    if (pos == "RS" && this.state.RS == this.state.userId) currPos = this.state.RS;
    else if (pos == "RF" && this.state.RF == this.state.userId) currPos = this.state.RF;
    else if (pos == "BS" && this.state.BS == this.state.userId) currPos = this.state.BS;
    else if (pos == "BF" && this.state.BF == this.state.userId) currPos = this.state.BF;

    const reqBody = JSON.stringify({
      userID: newUser,
      position: pos
    });
    try {
      if (currPos == "") {
        let res = await fetch(`/matches/${this.state.matchId}/joinmatch`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
          body: reqBody
        })
        res = await res.json();
        console.log("API setUser response", res);
        const info = res.info;
        this.setState({ RS: info.RS, RF: info.RF, BS: info.BS, BF: info.BF, Host: info.Host });
      } else if (currPos == this.state.userId) {
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
      setBlueScore,
      redScore,
      setRedScore
    } = this.props;
    const { words, positionState, matchId, userId, guessesLeft, message, isOver, winner, RS, RF, BS, BF, Host } = this.state;
    document.body.style.overflow = "noscroll";
    return (<div className={ classes.matchStyle }>
      <ChatBox
          submitHint={this.submitHint}
          matchID={matchId}
          userID={userId}
          position={matchDictionary[positionState]} />

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
