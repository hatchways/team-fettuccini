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
    this.socket = undefined;
  }

  componentDidUnmount = async () => {
    this.socket.disconnect(true);
  }

  componentDidMount = () => {
    if (this.props.location.state == null) {
      this.props.setIsMatchInProgres(false);
      this.props.history.push(`/waitingroom/${this.props.match.params.matchId}`);
    } else {
      const { matchId, matchState, positions } = this.props.location.state
      console.log("In game positions ");
      console.log(positions);
      const thisUser = auth.getUserInfo().id;
      let myRole;
      //Assign users to their respective positions
      if (positions.RS.userId == thisUser) {
        myRole = "RS";
      } else if (positions.RF.userId == thisUser) {
        myRole = "RF";
      } else if (positions.BS.userId == thisUser) {
        myRole = "BS";
      } else if (positions.BF.userId == thisUser) {
        myRole = "BF";
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
        this.socket.on('needToUpdate', () => {
          this.socket.emit('updateState', {
            matchID: this.state.matchId,
            userID: this.state.userId,
            updateToEveryone: false
          });
        });

        this.socket.emit('updateState', {
          matchID: this.state.matchId,
          userID: this.state.userId,
          updateToEveryone: true
        });

        console.log("After emit " + this.state);
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



  updateStateRes = (data) => {
    console.log("in updateStateRes");
    let res = data;
    console.log('res ping ', res)
    let { userId, positionState, words, guessesLeft, isOver, secondsLeft, turnId, roles, myRole, chatHistory } = this.state
    let resInfo = res.info

    //update the state if something has changed.
    let updateState = (resInfo.state !== positionState)
      || (Number(resInfo.numGuess) !== guessesLeft)
      || chatHistory.length !== resInfo.chatHistory.length

    //update the mapping of users to positions.
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
    //update the board if the state of a word has changed.
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


  isMyTurn = () => {
    if (!this.state.roles.hasOwnProperty(this.state.myRole)) {
      return false
    }

    return matchDictionary[this.state.positionState] === this.state.myRole
  }

  amISpy = () => {
    console.log("My role is " + this.state.myRole);
    return ["RS", "BS"].includes(this.state.myRole)
  }

  clickWord = async (e) => {

    if (!this.isMyTurn() || this.amISpy()) {
      return
    } else {
      let { myRole, turnId } = this.state
      let index = e.currentTarget.dataset.tag

      this.socket.emit('nextMove', {
        matchID: this.state.matchId,
        userID: this.state.userId,
        position: myRole,
        move: index,
        turnId: turnId
      });
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
  }

  submitHint = async (move) => {
    console.log("submit hint");
    console.log(this.state);
    const { myRole, matchId, userId, turnId } = this.state


    let reqMove, reqPosition

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
  }

  render() {
    console.log('local state', this.state)
    const {
      classes,
      setIsMatchInProgres,
      blueScore,
      redScore
    } = this.props;

    const { words, factions, positionState, guessesLeft, message, isOver, winner, chatHistory, secondsLeft } = this.state;

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

      <div className={`${classes.paper} ${classes.centerText}`}>
        <Typography variant="h4">
          {positionState} &nbsp;
      {this.isMyTurn() ? "(You)" : null}
        </Typography>
        <Typography variant="body1">{["RF", "BF"].includes(matchDictionary[positionState]) ? guessText : <>&nbsp;</>}</Typography>
        {message !== "" ? <p>{message}</p> : null}
        <div>
          <Typography variant="body1">Time remaining: {secondsLeft}</Typography>
        </div>
        <MappedWords classes={classes} words={words} factions={factions} clickWord={this.clickWord} spyView={spy} />
        {spy ? null : <Button variant="contained" color="primary" onClick={this.endFieldTurn}>End Turn</Button>}
      </div>
      {
        isOver ? (
          <GameOutcome
            isOver={isOver}
            setIsMatchInProgres={setIsMatchInProgres}
            winner={winner}
            blueScore={blueScore}
            redScore={redScore}
          />
        ) : null
      }
    </div >)
  }
}

export default withStyles(styleMatch)(Match)
