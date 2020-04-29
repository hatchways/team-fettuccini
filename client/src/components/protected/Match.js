import React, { Component } from "react";

import { Typography, Paper, Button, Grid } from "@material-ui/core";

import ChatBox from './ChatBox'
import MappedWords from './MappedWords'

import auth from '../auth/auth'
import matchDictionary from './matchDictionary'

import { withStyles } from "@material-ui/styles";
import styleMatch from "./styleMatch";
import GameOutcome from "./GameOutcome";
import socketIOClient from "socket.io-client";

import fetchUtil from './fetchUtil'

class Match extends Component {
  constructor(props) {
    super(props);

    this.props.setIsMatchInProgres(true);
    this.props.setBlueScore(0);
    this.props.setRedScore(0);

    this.state = {
      matchId: '',
      factions: [],
      myRole: '',
      userId: '',
      positionState: "",
      winner: "",
      turnId: "",
      secondsLeft: 60,
      Host: "",
      guessesLeft: 0,
      isOver: false,
      winner: "blue",
      words: [],
      chatHistory: [],
      roles: {},
      Host: ""
    }
    this.submitHint = this.submitHint.bind(this);
    this.clickWord = this.clickWord.bind(this);
    this.endFieldTurn = this.endFieldTurn.bind(this);
    this.updateStateRes = this.updateStateRes.bind(this);
    this.ping = this.ping.bind(this);
    this.isMyTurn = this.isMyTurn.bind(this);
    this.amISpy = this.amISpy.bind(this);
    this.socket = undefined;
  }

  componentDidUnmount = async () => {
	  this.socket.disconnect(true);
  }
  
  componentDidMount = () => {
    if (this.props.location.state == null) {
      this.props.history.push(`/waitingroom/${this.props.match.params.matchId}`);
    } else {
      const { matchId, matchState, positions } = this.props.location.state
      console.log("In game positions ");
      console.log(positions);
      const thisUser = auth.getUserInfo().id;
      let myRole;
      if (positions.RS.userId == thisUser) {
    	  myRole="RS";
      } else if (positions.RF.userId == thisUser) {
    	  myRole="RF";
      } else if (positions.BS.userId == thisUser) {
    	  myRole="BS";
      } else if (positions.BF.userId == thisUser) {
    	  myRole="BF";
      }
      console.log("Match State ");
      console.log(matchState);
      this.setState({
        ...this.state,
        userId: auth.getUserInfo().id,
        matchId: matchId,
        words: matchState.info.info.board,
        positionState: matchState.info.state,
        factions: matchState.info.info.factions,
        roles: { ...positions },
        myRole: myRole
      }, () => {
    	  
    	  this.socket = socketIOClient("http://localhost:3001/");
    	  this.socket.on('updateState', this.updateStateRes)
    	  this.socket.emit('updateState', {
          	  matchID: this.state.matchId,
          	  userID: this.state.userId,
            });
    	  
    	  console.log("After emit "+this.state);
      })
    }

    setInterval(() => {
      if (!this.state.isOver && this.state.secondsLeft > 0) {
        this.setState({
          secondsLeft: --this.state.secondsLeft
        });
      }
    }, 1000);
    
  }

  /*submitHintRes = (res) => {
	  this.updateStateRes(res.info)
	  let positionState = res.state
	  this.setState({ ...this.state, positionState, guessesLeft: Number(res.numGuess), message: "", secondsLeft: 60, turnId: res.turnId })
	   
  }
  
  endTurnRes = (res) => {
	    this.updateStateRes(res.info)
	    if (res.message === "Have to make at least one guess for a turn") {
	      this.setState({ ...this.state, message: res.message })
	    } else {
	      let positionState = res.info.state
	      this.setState({
	        ...this.state,
	        positionState,
	        guessesLeft: 0,
	        message: "",
	        secondsLeft: 60,
	        turnId: res.turnId,
	        factions: res.info.factions
	      })
	    }
  }
  
  clickWordRes = (res) => {
	  this.updateStateRes(res.info)
	  let { matchId, positionState, words, userId, myRole, secondsLeft, turnId, factions } = this.state
      let index = res.index
	  words[index] = res.info.info.board[index] !== words[index] ? res.info.info.board[index].slice(0, 2) + words[index] : words[index]
      if (factions != undefined) factions[index] = res.info.info.factions[index].slice(0, 2);

      this.props.setBlueScore(res.blueScore);
      this.props.setRedScore(res.redScore);

      this.setState({
        ...this.state,
        words,
        guessesLeft: Number(res.info.numGuess),
        positionState: res.info.state,
        message: "",
        isOver: res.isOver,
        winner: res.winner,
        secondsLeft: (turnId != res.turnId) ? 60 : secondsLeft,
        turnId: res.turnId,
        factions
      })
  }*/
  
  updateStateRes = (data) => {
	console.log("in updateStateRes");
	let res = data;
	console.log('res ping ', res)
	let { matchId, userId, positionState, words, guessesLeft, isOver, secondsLeft, turnId, roles, myRole, chatHistory } = this.state
    let resInfo = res.info
    /*if (res.info === "") {
      this.props.history.push("/welcome")
    }*/

    let updateState = (resInfo.state !== positionState)
      || (Number(resInfo.numGuess) !== guessesLeft)
      || chatHistory.length !== resInfo.chatHistory.length

    Object.keys(roles).forEach(role => {
      if (userId === resInfo[role].id) {
        myRole = role
      }

      if (!roles.hasOwnProperty(role)) {
        roles[role] = {
          name: resInfo[role].name,
          id: resInfo[role].id
        }
      } else if (roles[role].id !== resInfo[role].id) {
        roles[role] = {
          name: resInfo[role].name,
          id: resInfo[role].id
        }
        updateState = true
      }
    })

    console.log("update state")
    console.log(this.state)
    console.log(res)
    for (let i = 0; i < words.length; i++) {
      if (words[i].slice(0, 2) !== resInfo.info.board[i].slice(0, 2)) {
        updateState = true
        words[i] = resInfo.info.board[i].slice(0, 2) + words[i]
      }
    }

    if (updateState) {
      this.props.setBlueScore(res.blueScore);
      this.props.setRedScore(res.redScore);

      this.setState({
        ...this.state,
        words,
        positionState: resInfo.state,
        guessesLeft: Number(resInfo.numGuess),
        message: "",
        roles,
        myRole,
        Host: resInfo.Host,
        chatHistory: resInfo.chatHistory,
        isOver: res.isOver,
        winner: res.winner,
        secondsLeft: (turnId != res.turnId) ? 60 : secondsLeft,
        turnId: res.turnId,
        factions: resInfo.info.factions
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
	console.log("My role is " + this.state.myRole);
	return ["RS", "BS"].includes(this.state.myRole)
  }

  async ping() {
    /*let { matchId, userId, positionState, words, guessesLeft, isOver, secondsLeft, turnId, roles, myRole, chatHistory } = this.state
    if (words.length === 0 || isOver) {
      return;
    }

    let res

    try {
      res = await fetchUtil({
        url: `/matches/${matchId}/nextmove`,
        method: "POST",
        body: {
          userID: userId,
          position: "_PING",
          move: "_PING",
          turnId: turnId
        }
      })
    } catch (error) {
      console.log('error @ PING .json() \n', error)
    }
    this.updateStateRes(res);*/
    /*console.log('res ping ', res)
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
      if (words[i].slice(0, 2) !== res.info.board[i].slice(0, 2)) {
        updateState = true
        words[i] = res.info.board[i].slice(0, 2) + words[i]
      }
    }

    if (updateState) {
      this.props.setBlueScore(res.blueScore);
      this.props.setRedScore(res.redScore);

      this.setState({
        ...this.state,
        words,
        positionState: res.state,
        guessesLeft: Number(res.numGuess),
        message: "",
        roles,
        myRole,
        Host: res.Host,
        chatHistory: res.chatHistory,
        isOver: res.isOver,
        winner: res.winner,
        secondsLeft: (turnId != res.turnId) ? 60 : secondsLeft,
        turnId: res.turnId,
        factions: res.info.factions
      })
    }*/
  }

  clickWord = async (e) => {
    if (!this.isMyTurn() || this.amISpy()) {
      return
    } else {
      let { matchId, positionState, words, userId, myRole, secondsLeft, turnId, factions } = this.state
      let index = e.currentTarget.dataset.tag
      let res

      this.socket.emit('nextMove', {
      	  matchID: this.state.matchId,
      	  userID: this.state.userId,
      	  position: myRole,
      	  move: index,
      	  turnId: turnId
        });
      /*try {
        res = await fetchUtil({
          url: `/matches/${matchId}/nextmove`,
          method: "POST",
          body: {
            userID: userId,
            position: myRole,
            move: index,
            turnId: turnId
          }
        })
      } catch (error) {
        console.log('error @ API /matches/:matchId/nextmove')
      }

      words[index] = res.info.info.board[index] !== words[index] ? res.info.info.board[index].slice(0, 2) + words[index] : words[index]
      if (factions != undefined) factions[index] = res.info.info.factions[index].slice(0, 2);

      this.props.setBlueScore(res.blueScore);
      this.props.setRedScore(res.redScore);

      this.setState({
        ...this.state,
        words,
        guessesLeft: Number(res.info.numGuess),
        positionState: res.info.state,
        message: "",
        isOver: res.isOver,
        winner: res.winner,
        secondsLeft: (turnId != res.turnId) ? 60 : secondsLeft,
        turnId: res.turnId,
        factions
      })*/
    }
  }

  endFieldTurn = async () => {
    if (!this.isMyTurn() || this.amISpy()) {
      return
    }
    const { myRole, turnId } = this.state

    let res

    this.socket.emit('nextMove', {
    	  matchID: this.state.matchId,
    	  userID: this.state.userId,
    	  position: myRole,
    	  move: "_END",
    	  turnId: turnId
      });
    
    /*try {
      res = await fetchUtil({
        url: `/matches/${this.state.matchId}/nextmove`,
        method: "POST",
        body: {
          userID: this.state.userId,
          position: myRole,
          move: matchDictionary.end,
          turnId: this.state.turnId
        }
      })
    } catch (error) {
      console.log('error @ API /matches/:matchId/nextmove to end turn')
    }

    if (res.message === "Have to make at least one guess for a turn") {
      this.setState({ ...this.state, message: res.message }, ()=>{this.ping()})
    } else {
      let positionState = res.info.state
      this.setState({
        ...this.state,
        positionState,
        guessesLeft: 0,
        message: "",
        secondsLeft: 60,
        turnId: res.turnId,
        factions: res.info.factions
      }, ()=>{this.ping()})
    }*/
  }

  async submitHint(move) {
	  console.log("submit hint");
	  console.log(this.state);
    const { myRole, matchId, userId, turnId } = this.state


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

    this.socket.emit('nextMove', {
    	matchID: matchId,
    	userID: userId,
    	position: reqPosition,
    	move: reqMove,
    	name: auth.getUserInfo().name,
    	role: myRole,
    	turnId: turnId
    })
    /*try {
      res = await fetchUtil({
        url: `/matches/${matchId}/nextmove`,
        method: "POST",
        body: {
          userID: userId,
          position: reqPosition,
          move: reqMove,
          name: auth.getUserInfo().name,
          role: myRole,
          turnId: turnId
        }
      })

    } catch (error) {
      console.log('error @ submitHint API')
    }

    let positionState = res.state

    this.setState({ ...this.state, positionState, guessesLeft: Number(res.numGuess), message: "", secondsLeft: 60, turnId: res.turnId }, ()=>{this.ping()})
    */
  }

  render() {
    console.log('local state', this.state)
    const {
      classes,
      setIsMatchInProgres,
      blueScore,
      redScore
    } = this.props;

    const { words, factions, positionState, matchId, userId, guessesLeft, message, isOver, winner, chatHistory, myRole, secondsLeft } = this.state;

    let guessText;
    if (guessesLeft >= 0) guessText = (guessesLeft - 1) + " +1 guesses left";
    else guessText = "0 guesses left";
    document.body.style.overflow = "noscroll";
    const spy = this.amISpy();
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
   
        <p>{["RF", "BF"].includes(matchDictionary[positionState]) ? guessText : <>&nbsp;</>}</p>
        {message !== "" ? <p>{message}</p> : null}
        <p style={{ fontFamily: "Roboto", fontSize: "20px" }}>Time remaining: {secondsLeft}</p>
        <Grid container item xs={12} className={classes.standardFlex}>
          <MappedWords classes={classes} words={words} factions={factions} clickWord={this.clickWord} spyView={spy} />
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
