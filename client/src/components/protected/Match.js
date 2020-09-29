

import React, { useRef, useEffect, useState } from "react";

import { Typography, Button } from "@material-ui/core";

import ChatBox from './ChatBox'
import MappedWords from './MappedWords'

import auth from '../auth/auth'
import matchDictionary from './matchDictionary'

import { withStyles } from "@material-ui/styles";
import styleMatch from "./styleMatch";
import GameOutcome from "./GameOutcome";
import socketIOClient from "socket.io-client";

import fetchUtil from './fetchUtil'

function Match(props) {
	
    const [ state, setState ] = useState({
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
    });
    
    const socketRef = useRef(socketIOClient("http://localhost:3001/"));
    const stateRef = useRef(state);
    const intervalRef = useRef(undefined);
    const blueScoreRef = useRef(0);
    const redScoreRef = useRef(0);
    
    useEffect(()=>{
    	if (props.location.state == null) {
	      props.setIsMatchInProgres(false);
	      props.history.push(`/waitingroom/${this.props.match.params.matchId}`);
	    } else {
	      const { matchId, matchState, positions } = props.location.state
	      props.setIsMatchInProgres(true);
	      props.setBlueScore(blueScoreRef.current);
	      props.setRedScore(redScoreRef.current);
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
	      setState({
	        ...state,
	        userId: auth.getUserInfo().id,
	        matchId: matchId,
	        words: matchState.info.info.board,
	        positionState: matchState.info.state,
	        factions: matchState.info.info.factions,
	        roles: { ...positions },
	        myRole: myRole
	      });

	      socketRef.current.on('updateState', updateStateRes)
	      socketRef.current.on('needToUpdate', () => {
	        socketRef.current.emit('updateState', {
	          matchID: matchId,
	          userID: auth.getUserInfo().id,
	          updateToEveryone: false
	        });
	      });

	      socketRef.current.emit('updateState', {
	        matchID: matchId,
	        userID: auth.getUserInfo().id,
	        updateToEveryone: true
	      });

	      intervalRef.current = setInterval(() => {
		      if (!state.isOver && state.secondsLeft > 0) {
		        setState((st)=>{ return { ...st, secondsLeft: --st.secondsLeft } });
		      }
		    }, 1000);
	    }
	    
	    return ()=>{socketRef.current.disconnect(true);clearInterval(intervalRef.current);}

    }, [])

    useEffect(()=>{
    	stateRef.current = state;
    }, [state])
    
  const updateStateRes = (data) => {
    console.log("in updateStateRes");
    let res = data;
    console.log('res ping ', res)
    let { userId, positionState, words, guessesLeft, isOver, secondsLeft, turnId, roles, myRole, chatHistory } = stateRef.current
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
    console.log(res)
    //update the board if the state of a word has changed.
    for (let i = 0; i < words.length; i++) {
      if (words[i].slice(0, 2) !== resInfo.info.board[i].slice(0, 2)) {
        updateState = true
        words[i] = resInfo.info.board[i].slice(0, 2) + words[i]
      }
    }

    if (updateState) {
      props.setBlueScore(res.blueScore);
      props.setRedScore(res.redScore);

      setState({
        ...stateRef.current,
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


  const isMyTurn = () => {
    if (!state.roles.hasOwnProperty(state.myRole)) {
      return false
    }

    return matchDictionary[state.positionState] === state.myRole
  }

  const amISpy = () => {
    console.log("My role is " + state.myRole);
    return ["RS", "BS"].includes(state.myRole)
  }

  const clickWord = async (e) => {

    if (!isMyTurn() || amISpy()) {
      return
    } else {
      let { myRole, turnId } = state
      let index = e.currentTarget.dataset.tag

      socketRef.current.emit('nextMove', {
        matchID: state.matchId,
        userID: state.userId,
        position: myRole,
        move: index,
        turnId: turnId
      });
    }
  }

  const endFieldTurn = async () => {
    if (!isMyTurn() || amISpy()) {
      return
    }
    const { myRole, turnId } = state

    let res

    socketRef.current.emit('nextMove', {
      matchID: state.matchId,
      userID: state.userId,
      position: myRole,
      move: "_END",
      turnId: turnId
    });
  }

  const submitHint = async (move) => {
    console.log("submit hint");
    const { myRole, matchId, userId, turnId } = state


    let reqMove, reqPosition

    if (amISpy()) {
      if (isMyTurn()) {
        reqMove = `${move.num} ${move.word}`
        reqPosition = myRole
      } else {
        return
      }
    } else if (!amISpy()) {
      reqMove = move.word
      reqPosition = "_CHAT"
    }

    socketRef.current.emit('nextMove', {
      matchID: matchId,
      userID: userId,
      position: reqPosition,
      move: reqMove,
      name: auth.getUserInfo().name,
      role: myRole,
      turnId: turnId
    })
  }

    const {
      classes,
      setIsMatchInProgres,
      blueScore,
      redScore
    } = props;

    const { words, factions, positionState, guessesLeft, message, isOver, winner, chatHistory, secondsLeft } = state;

    let guessText;
    if (guessesLeft >= 0) guessText = (guessesLeft - 1) + " +1 guesses left";
    else guessText = "0 guesses left";
    document.body.style.overflow = "noscroll";
    const spy = amISpy();
    return (<div className={classes.matchStyle}>
      <ChatBox
        submitHint={submitHint}
        chatHistory={chatHistory}
      />

      <div className={`${classes.paper} ${classes.centerText}`}>
        <Typography variant="h4">
          {positionState} &nbsp;
      {isMyTurn() ? "(You)" : null}
        </Typography>
        <Typography variant="body1">{["RF", "BF"].includes(matchDictionary[positionState]) ? guessText : <>&nbsp;</>}</Typography>
        {message !== "" ? <p>{message}</p> : null}
        <div>
          <Typography variant="body1">Time remaining: {secondsLeft}</Typography>
        </div>
        <MappedWords classes={classes} words={words} factions={factions} clickWord={clickWord} spyView={spy} />
        {spy ? null : <Button variant="contained" color="primary" onClick={endFieldTurn}>End Turn</Button>}
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

export default withStyles(styleMatch)(Match)

