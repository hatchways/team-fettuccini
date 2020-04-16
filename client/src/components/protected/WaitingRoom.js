import React, { Fragment } from "react";
import { Typography, Paper, Button, FormLabel, Grid } from "@material-ui/core";
import LinkIcon from '@material-ui/icons/Link';
import CheckIcon from '@material-ui/icons/Check';

import { withStyles } from "@material-ui/core/styles";

import style from "./styleWaitingNewGame"

import auth from '../auth/auth'

class WaitingRoom
  extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      matchId: '',
      playerList: [],
      roles: {
        RS: { n: 0, name: "Red Spy Master" },
        RF: { n: 1, name: "Red Field Agent" },
        BS: { n: 1, name: "Blue Spy Master" },
        BF: { n: 1, name: "Blue Field Agent" },
        matchState: []
      }
    }
  }

  componentDidMount = async () => {

    let { roles } = this.state
    let position = this.assignTeam()
    roles[position].n += 1

    let res
    const { matchId } = this.props.match.params
    let reqBody = JSON.stringify({
      userID: auth.getUserInfo().id,
      position
    })

    try {
      res = await fetch(`/matches/${matchId}/joinmatch`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
        body: reqBody
      })
      res = await res.json()

      this.setState({
        ...this.state,
        matchId,
        playerList:
          [...this.state.playerList, {
            name: auth.getUserInfo().username,
            position: roles[position].name
          }],
        roles,
        matchState: res.info
      })
    } catch (error) {
      console.log("API error /:matchid/joinmatch")
    }

  }

  assignTeam = () => {
    let { roles } = this.state

    if (roles.RS.n === 0) {
      return 'RS'
    } else if (roles.BS.n === 0) {
      return 'BS'
    } else {
      return roles.RF.n > roles.BF.n ? 'BF' : 'RF'
    }
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

  render() {
    const { playerList } = this.state
    const { classes } = this.props;
    const mappedPlayers = playerList.length > 0
      ? (this.state.playerList.map((player, idx) => (
        <div key={`invite${idx}`}>
          <Typography variant="body1">
            <CheckIcon className={classes.mainFill} />
            {player.name} - {player.position}
          </Typography>
        </div>))) : null

    return <Fragment>
      <Paper className="MuiPaper-customPrimary">
        <Typography variant="h4">New Game</Typography>
        {document.queryCommandSupported('copy') && <textarea
          readOnly
          ref={(textarea) => this.textArea = textarea}
          className={classes.hiddenText}
          value={this.state.matchId} />}
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item>
            <FormLabel>Players ready for match:</FormLabel>
            <div className={classes.leftText}>{mappedPlayers}</div>
          </Grid>
          <Grid item className={classes.borderLeft}>
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
