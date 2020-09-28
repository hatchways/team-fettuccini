import React, { Fragment, useState, useEffect, useRef } from "react";
import io from "socket.io-client";

import { Typography, Paper, Button, FormLabel, Grid, List, ListItem } from "@material-ui/core";
import LinkIcon from '@material-ui/icons/Link';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import { withStyles } from "@material-ui/core/styles";
import style from "./styleWaitingNewGame"
import auth from '../auth/auth'

import fetchUtil from './fetchUtil'

const waitingRoomDictionary = {
  RS: "Red Spy Master",
  RF: "Red Field Agent",
  BS: "Blue Spy Master",
  BF: "Blue Field Agent"
}

function WaitingRoom(props) {

    const [ state, setState] = useState({
      userId: '',
      name: '',
      matchId: '',
      positions: {},
      matchState: {},
    });

    const socketRef = useRef(io("http://localhost:3001"));
    const stateRef = useRef(state);
    const textArea = useRef(undefined);
    
    useEffect(()=>{
    	const userId = auth.getUserInfo().id
        const name = auth.getUserInfo().name
        const { matchId } = props.match.params
        
        setState({
          ...state,
          matchId,
          name,
          userId
        })
	
        socketRef.current.on('changePosition', updatePositions)

        socketRef.current.emit('changePosition', {
          matchID: matchId,
          userID: userId,
          name: name,
          position: "",
          action: "joinmatch"
        });
        return ()=>socketRef.current.disconnect(true);
    }, [])

    useEffect(()=>{
    	stateRef.current = state;
    }, [state]);
    
  const copyLink = () => {
    textArea.current.value = state.matchId
    textArea.current.select();
    document.execCommand('copy')
  }

  const startMatch = () => {
    const { matchId, matchState, positions } = state
    props.history.push({
      pathname: `/match/${matchId}`,
      state: { matchId, matchState, positions }
    })

  }

  const updatePositions = (data) => {
    console.log("in update positions")
    console.log(data);
    let res = data.info;
    const { userId, matchId, positions, name } = stateRef.current
    for (let pos in waitingRoomDictionary) {
      if (res.hasOwnProperty(pos)) {
        if (res[pos].id === "" || Object.keys(res[pos]).length == 0) { // if role is empty
          if (positions.hasOwnProperty(pos)) {
            delete positions[pos]
          }
        } else { // if role is filled
          if (positions.hasOwnProperty(pos)) {
            if (positions[pos].userId !== res[pos].id) {
              positions[pos] = {
                userId: res[pos].id,
                name: res[pos].name
              }
            }
          } else {
            positions[pos] = {
              role: waitingRoomDictionary[pos],
              userId: res[pos].id,
              name: res[pos].name
            }
          }
        }
      } else {
        if (positions.hasOwnProperty(pos)) {
          delete positions[pos]
        }
      }
    }
    console.log(positions);
    setState({
      ...stateRef.current,
      positions,
      matchState: data
    });
  }

  const changePosition = (e) => {
    const { userId, matchId, positions, name } = state
    let res
    const position = e.currentTarget.dataset.id.slice(0, 2)
    const action = e.currentTarget.dataset.id.slice(2)

    socketRef.current.emit('changePosition', {
      matchID: matchId,
      userID: userId,
      name: name,
      position: position,
      action: action
    });
  }

    const { positions, userId } = state
    const { classes } = props;

    if (Object.keys(positions).length === 4) {
      startMatch()
    }

    const mapAvailablePos = Object.keys(waitingRoomDictionary)
      .filter(pos => !positions.hasOwnProperty(pos))
      .map((pos, i) => (
        <ListItem key={`openRole-${i}`} className={classes.listItem}>
          <Typography variant="body1">{waitingRoomDictionary[pos]}
            &nbsp;&nbsp;
          </Typography>
          <AddCircleIcon className={classes.iconHover} data-id={`${pos}joinmatch`} onClick={changePosition} />
        </ListItem>))

    const mappedPlayers = Object.keys(positions)
      .map((pos, idx) => (
        <ListItem key={`invite${idx}`} className={classes.verticalAlign}>
          <CheckIcon className={classes.mainFill} />
          <Typography variant="body1">
            {positions[pos].name} -&nbsp;
            {positions[pos].role}
            {positions[pos].userId === userId ? ' (You)' : null} &nbsp;&nbsp;
          </Typography>
          <CancelIcon className={classes.iconHover} data-id={`${pos}leavematch`} onClick={changePosition} />
        </ListItem>))

    return <Fragment>
      <Paper className="MuiPaper-customPrimary">
        <Typography variant="h4">New Game</Typography>
        {document.queryCommandSupported('copy') && <textarea
          readOnly
          ref={(textarea) => textArea.current = textarea}
          className={classes.hiddenText}
          value={state.matchId} />}

        <List className={classes.availableRoles}>
          <Typography variant="h5">Available roles</Typography>
          {mapAvailablePos}
        </List>

        <Grid container className={classes.gridContainer}>
          <Grid item>
            <FormLabel>Players ready for match:</FormLabel>
            <List className={classes.leftText}>{mappedPlayers}</List>
          </Grid>
          <Grid item className={classes.borderLeft}>
            <FormLabel className={classes.centerText}>Share match id:</FormLabel>
            <Button variant="outlined" onClick={copyLink}><LinkIcon className={classes.rotate45} />Copy</Button>
          </Grid>
        </Grid>
        <div>
          <Button variant="contained" disabled={Object.keys(positions).length !== 4} color="primary" onClick={startMatch}>Start Match</Button>
        </div>
      </Paper>
    </Fragment>

}
export default withStyles(style)(WaitingRoom)
