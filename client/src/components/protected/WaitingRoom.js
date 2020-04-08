import React, { Fragment } from "react";
import { Typography, Paper, Button, FormLabel, TextField, Grid } from "@material-ui/core";
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
      roles: { RS: 0, RF: 0, BS: 0, BF: 0 }
    }
  }

  componentDidMount = async () => {
    // this only works for users that have crated the game...
    // if (this.props.location.state == null || this.props.match.params.matchId !== this.props.location.state.matchId) {
    //   this.props.history.push('/welcome')
    // }
    let { roles } = this.state
    let position = this.assignTeam()

    let res
    const { matchId } = this.props.match.params.matchId
    let reqBody = JSON.stringify({
      userID: auth.getUserInfo().id,
      position
    })
    console.log(reqBody)
    console.log(this.props)
    try {
      res = await fetch(`/${this.props.match.params.matchId}/joinmatch`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
        body: reqBody
      })
      res = await res.json()
      console.log('res', res)
      this.setState({ ...this.state, matchId, playerList: [...this.state.playerList, { name: auth.getUserInfo().username, position }] })
    } catch (error) {
      console.log("API error /:matchid/joinmatch")
    }

  }

  assignTeam = () => {
    let { roles } = this.state

    if (roles.RS === 0) {
      return 'RS'
    } else if (roles.BS === 0) {
      return 'BS'
    } else {
      return roles.RF > roles.BF ? 'BF' : 'RF'
    }
  }

  copyLink = () => {
    this.textArea.value = this.state.matchId
    this.textArea.select();
    document.execCommand('copy')
  }

  startMatch = () => {
    const { matchId } = this.state
    this.props.history.push({
      pathname: `/match/${matchId}`,
      state: { matchId }
    })
  }

  render() {
    const { playerList, matchId } = this.state
    const { classes } = this.props;
    const mappedPlayers = playerList.length > 0
      ? (this.state.playerList.map((player, idx) => (
        <div key={`invite${idx}`}>
          <CheckIcon className={classes.mainFill} />
          {player.name} - {player.position}
        </div>))) : null

    return <Fragment>
      <Paper className="MuiPaper-customPrimary">
        <Typography variant="h4">Match Id: {matchId}</Typography>
        {document.queryCommandSupported('copy') && <textarea
          readOnly
          ref={(textarea) => this.textArea = textarea}
          style={{ opacity: '0', position: 'absolute' }}
          value={this.state.matchId} />}
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item>
            <FormLabel>Players ready for match:</FormLabel>
            <div className={classes.leftText}>{mappedPlayers}</div>
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
