import React, { Fragment } from "react";
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

class WaitingRoom
  extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      name: '',
      matchId: '',
      positions: {},
      matchState: {},
    }
    this.ping = this.ping.bind(this)
    this.changePosition = this.changePosition.bind(this)
  }

  async ping() {
    let { userId, matchId, positions, matchState } = this.state

    let res
    let updateState = false

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
    console.log('res ping ', res)

    updateState = (matchState.state !== res.state && res.state != undefined);

    for (let pos in waitingRoomDictionary) {
      if (res.hasOwnProperty(pos)) {
        if (res[pos].id === "" || Object.keys(res[pos]).length == 0) { // if role is empty
          if (positions.hasOwnProperty(pos)) {
            delete positions[pos]
            updateState = true
          }
        } else { // if role is filled
          if (positions.hasOwnProperty(pos)) {
            if (positions[pos].userId !== res[pos].id) {
              positions[pos] = {
                userId: res[pos].id,
                name: res[pos].name
              }
              updateState = true
            }
          } else {
            positions[pos] = {
              role: waitingRoomDictionary[pos],
              userId: res[pos].id,
              name: res[pos].name
            }
            updateState = true
          }
        }
      } else {
        if (positions.hasOwnProperty(pos)) {
          delete positions[pos]
          updateState = true
        }
      }
    }
    if (updateState) {
      this.setState({
        ...this.state,
        positions,
        matchState: res
      })
    }
  }

  componentWillUnmount = async () => {
    this.socket.disconnect(true);
  }

  componentDidMount = () => {
    const userId = auth.getUserInfo().id
    const name = auth.getUserInfo().name
    const { matchId } = this.props.match.params

    this.setState({
      ...this.state,
      matchId,
      name,
      userId,
    }, () => {
      
      this.socket = io("http://localhost:3001");
    	
      this.socket.on('changePosition', this.updatePositions)

      this.socket.emit('changePosition', {
        matchID: this.state.matchId,
        userID: this.state.userId,
        name: this.state.name,
        position: "",
        action: "joinmatch"
      });
    })

  }

  copyLink = () => {
    this.textArea.value = this.state.matchId
    this.textArea.select();
    document.execCommand('copy')
  }

  startMatch = () => {
    const { matchId, matchState, positions } = this.state
    this.props.history.push({
      pathname: `/match/${matchId}`,
      state: { matchId, matchState, positions }
    })

  }

  updatePositions = (data) => {
    console.log("in update positions")
    console.log(data);
    let res = data.info;
    const { userId, matchId, positions, name } = this.state
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
    this.setState({
      ...this.state,
      positions,
      matchState: data
    });
  }

  async changePosition(e) {
    const { userId, matchId, positions, name } = this.state
    let res
    const position = e.currentTarget.dataset.id.slice(0, 2)
    const action = e.currentTarget.dataset.id.slice(2)

    this.socket.emit('changePosition', {
      matchID: matchId,
      userID: userId,
      name: name,
      position: position,
      action: action
    });
  }

  render() {
    const { positions, userId } = this.state
    const { classes } = this.props;

    if (Object.keys(positions).length === 4) {
      this.startMatch()
    }

    const mapAvailablePos = Object.keys(waitingRoomDictionary)
      .filter(pos => !positions.hasOwnProperty(pos))
      .map((pos, i) => (
        <ListItem key={`openRole-${i}`} className={classes.listItem}>
          <Typography variant="body1">{waitingRoomDictionary[pos]}
            &nbsp;&nbsp;
          </Typography>
          <AddCircleIcon className={classes.iconHover} data-id={`${pos}joinmatch`} onClick={this.changePosition} />
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
          <CancelIcon className={classes.iconHover} data-id={`${pos}leavematch`} onClick={this.changePosition} />
        </ListItem>))

    return <Fragment>
      <Paper className="MuiPaper-customPrimary">
        <Typography variant="h4">New Game</Typography>
        {document.queryCommandSupported('copy') && <textarea
          readOnly
          ref={(textarea) => this.textArea = textarea}
          className={classes.hiddenText}
          value={this.state.matchId} />}

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
            <Button variant="outlined" onClick={this.copyLink}><LinkIcon className={classes.rotate45} />Copy</Button>
          </Grid>
        </Grid>
        <div>
          <Button variant="contained" disabled={Object.keys(positions).length !== 4} color="primary" onClick={this.startMatch}>Start Match</Button>
        </div>
      </Paper>
    </Fragment>
  }
}
export default withStyles(style)(WaitingRoom)
