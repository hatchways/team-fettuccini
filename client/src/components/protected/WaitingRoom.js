import React, { Fragment } from "react";
import { Typography, Paper, Button, FormLabel, Grid, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import LinkIcon from '@material-ui/icons/Link';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import ServerPing from './ServerPing'

import { withStyles } from "@material-ui/core/styles";
import style from "./styleWaitingNewGame"
import auth from '../auth/auth'

import fetchUtil from './fetchUtil'
// TODO make this into a file
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
      matchId: '',
      positions: {},
      matchState: {},
    }
    this.ping = this.ping.bind(this)
    this.changePosition = this.changePosition.bind(this)
  }

  async ping() {
    let { userId, matchId, positions } = this.state

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

    for (let pos in waitingRoomDictionary) {
      if (res[pos] === "") { // if role is empty
        if (positions.hasOwnProperty(pos)) {
          delete positions[pos]
          updateState = true
        }
      } else { // if role is filled
        if (positions.hasOwnProperty(pos)) {
          if (positions[pos].userId !== res[pos]) {
            positions[pos].userId = res[pos]
            updateState = true
          }
        } else {
          positions[pos] = {
            role: waitingRoomDictionary[pos],
            userId: res[pos]
          }
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
    if (Object.keys(positions).length === 4) {
      this.startMatch()
    }
  }

  componentDidMount = async () => {
    let { positions } = this.state

    const userId = auth.getUserInfo().id
    const { matchId } = this.props.match.params

    this.setState({
      ...this.state,
      matchId,
      userId,
    })
  }

  copyLink = () => {
    this.textArea.value = this.state.matchId
    this.textArea.select();
    document.execCommand('copy')
  }

  startMatch = () => {
    const { matchId, matchState } = this.state
    this.props.history.push({
      pathname: `/match/${matchId}`,
      state: { matchId, matchState }
    })
  }

  async changePosition(e) {
    const { userId, matchId, positions } = this.state
    let res

    const position = e.currentTarget.dataset.id.slice(0, 2)
    const action = e.currentTarget.dataset.id.slice(2)

    let updateState = false

    try {

      res = await fetchUtil({
        url: `/matches/${matchId}/${action}`,
        method: "POST",
        body: {
          userID: userId,
          position
        }
      })


    } catch (error) {
      console.log('error @ PING .json() \n', error)
    }

    res = res.info

    console.log('res ', res)

    Object.keys(waitingRoomDictionary).forEach(pos => {
      if (res[pos] === "") {
        if (positions.hasOwnProperty(pos)) {
          delete positions[pos]
        }
      } else {
        positions[pos] = {
          role: waitingRoomDictionary[pos],
          userId: res[pos]
        }
      }
    })

    this.setState({
      ...this.state,
      positions
    })
  }

  render() {
    console.log('local state ', this.state)
    const { positions, matchId, userId } = this.state
    const { classes } = this.props;

    const mapAvailablePos = Object.keys(waitingRoomDictionary)
      .filter(pos => !positions.hasOwnProperty(pos))
      .map((pos, i) => (
        <ListItem button data-id={`${pos}joinmatch`} key={`openRole-${i}`} className={classes.listItem} onClick={this.changePosition}>
          <ListItemText primary={waitingRoomDictionary[pos]} className={classes.itemText} />
          &nbsp;&nbsp;<AddCircleIcon />
        </ListItem>))

    const mappedPlayers = Object.keys(positions)
      .map((player, idx) => (
        <ListItem key={`invite${idx}`} className={classes.verticalAlign}>
          <CheckIcon className={classes.mainFill} />
          {positions[player].role} {positions[player].userId === userId ? '(You)' : null} &nbsp;&nbsp;
          <CancelIcon className={classes.iconHover} data-id={`${player}leavematch`} onClick={this.changePosition} />
        </ListItem>))

    return <Fragment>
      <Paper className="MuiPaper-customPrimary">
        <Typography variant="h4">Match Id: {matchId}</Typography>
        {document.queryCommandSupported('copy') && <textarea
          readOnly
          ref={(textarea) => this.textArea = textarea}
          style={{ opacity: '0', position: 'absolute' }}
          value={this.state.matchId} />}

        <ServerPing ping={this.ping} />

        <List className={classes.availableRoles}>
          <Typography variant="h5">Available roles</Typography>
          {mapAvailablePos}
        </List>

        <Grid container className={classes.gridContainer}>
          <Grid item>
            <FormLabel>Players ready for match:</FormLabel>
            <List className={classes.leftText}>{mappedPlayers}</List>
          </Grid>
          <Grid item>
            <FormLabel className={classes.centerText}>Share match id:</FormLabel>
            <Button variant="outlined" onClick={this.copyLink}><LinkIcon className={classes.rotate45} />Copy</Button>
          </Grid>
        </Grid>
        <div>
          <Button variant="contained" color="primary" onClick={this.startMatch}>Start Match</Button>
        </div>
      </Paper>
    </Fragment>
  }
}
export default withStyles(style)(WaitingRoom)
