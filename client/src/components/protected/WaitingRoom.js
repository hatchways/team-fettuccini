import React, { Fragment } from "react";
import { Typography, Paper, Button, FormLabel, Grid } from "@material-ui/core";
import LinkIcon from '@material-ui/icons/Link';
import CheckIcon from '@material-ui/icons/Check';
import { withStyles } from "@material-ui/core/styles";

import UserDisplay from './UserDisplay'
import ServerPing from './ServerPing'

import style from "./styleWaitingNewGame"
import auth from '../auth/auth'

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
    this.assignTeam = this.assignTeam.bind(this)
  }

  async ping() {
    /* todo
      check if state of players changed

      fetch

      compare states
      if diff
        setState
    */
    let { positions } = this.state

    const userId = auth.getUserInfo().id
    const { matchId } = this.props.match.params

    let res, hasPosition, reqBody, position
    let arr = ["RS", "RF", "BS", "BF"]

    try {
      reqBody = JSON.stringify({
        userID: userId,
        position: "_PING",
        move: "_PING"
      })

      res = await fetch(`/matches/${matchId}/nextmove`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
        body: reqBody
      })
      console.log('\n API PING raw', res)

      if (res.status !== 200) {
        res = await res.text()
        console.error('failed request :: ', res)
      }
    } catch (error) {
      console.log('error @ PING raw', error)
    }

    try {
      res = await res.json()

      hasPosition = false

      arr.forEach(pos => {
        if (res[pos] !== "") {
          positions[pos] = {
            role: waitingRoomDictionary[pos],
            userId: res[pos]
          }
          if (userId === res[pos]) {
            hasPosition = true
          }
        }
      })
    } catch (error) {
      console.log('error @ PING .json() \n', error)
    }

  }

  componentDidMount = async () => {
    let { positions } = this.state

    const userId = auth.getUserInfo().id
    const { matchId } = this.props.match.params

    let res, hasPosition, reqBody, position
    let arr = ["RS", "RF", "BS", "BF"]

    try {
      reqBody = JSON.stringify({
        userID: userId,
        position: "_PING",
        move: "_PING"
      })

      res = await fetch(`/matches/${matchId}/nextmove`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
        body: reqBody
      })
      // console.log('\n API PING raw', res)

      if (res.status !== 200) {
        res = await res.text()
        console.error('failed request :: ', res)
      }
    } catch (error) {
      console.log('error @ PING raw', error)
    }

    try {
      res = await res.json()
      // console.log('\n component did mount.json', res)

      hasPosition = false

      arr.forEach(pos => {
        if (res[pos] !== "") {
          positions[pos] = {
            role: waitingRoomDictionary[pos],
            userId: res[pos]
          }
          if (userId === res[pos]) {
            hasPosition = true
          }
        }
      })
    } catch (error) {
      console.log('error @ PING .json() \n', error)
    }

    if (!hasPosition) {
      let { RS, RF, BS, BF } = res
      position = this.assignTeam({ userId, RS, RF, BS, BF })
      reqBody = JSON.stringify({
        userID: userId,
        position
      })

      try {
        res = await fetch(`/matches/${matchId}/joinmatch`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
          body: reqBody
        })

        if (res.status !== 200) {
          res = await res.text()
          console.error('failed request :: ', res)
        }
      } catch (error) {
        console.log("API error /:matchid/joinmatch")
      }

      try {
        res = await res.json()
        res = res.info

        arr.forEach(pos => {
          if (res[pos] !== "") {
            positions[pos] = {
              role: waitingRoomDictionary[pos],
              userId: res[pos]
            }
          }
        })
      } catch (error) {
        console.log(error.message)
      }
    }

    console.log(res)
    this.setState({
      ...this.state,
      matchState: res,
      positions,
      matchId,
      userId,
    })
  }

  assignTeam = ({ userId, RS, RF, BS, BF }) => {
    if (RS === "") {
      return 'RS'
    } else if (BS === "") {
      return 'BS'
    } else if (RF === "") {
      return 'RF'
    } else if (BF === "") {
      return 'BF'
    } else {
      console.log('edge case @ assingTeam, need to redirect to match')
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

  // setUser = async (player, pos) => {

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

  //   let newUser = auth.getUserInfo().id;
  //   let currPos = "";
  //   if (pos === "RS" && this.state.RS === this.state.userId) currPos = this.state.RS;
  //   else if (pos === "RF" && this.state.RF === this.state.userId) currPos = this.state.RF;
  //   else if (pos === "BS" && this.state.BS === this.state.userId) currPos = this.state.BS;
  //   else if (pos === "BF" && this.state.BF === this.state.userId) currPos = this.state.BF;

  //   const reqBody = JSON.stringify({
  //     userID: newUser,
  //     position: pos
  //   });
  //   try {
  //     if (currPos === "") {
  //       let res = await fetch(`/matches/${this.state.matchId}/joinmatch`, {
  //         method: "POST",
  //         headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
  //         body: reqBody
  //       })
  //       res = await res.json();
  //       console.log("API setUser response", res);
  //       const info = res.info;
  //       this.setState({ RS: info.RS, RF: info.RF, BS: info.BS, BF: info.BF, Host: info.Host });
  //     } else if (currPos === this.state.userId) {
  //       let res = await fetch(`/matches/${this.state.matchId}/leavematch`, {
  //         method: "POST",
  //         headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
  //         body: reqBody
  //       })
  //       res = await res.json();
  //       console.log("API setUser response", res);
  //       const info = res.info;
  //       this.setState({ RS: info.RS, RF: info.RF, BS: info.BS, BF: info.BF, Host: info.Host });
  //     }

  //   } catch (error) {
  //     console.log('error @joingame API');
  //   }
  // }

  render() {
    console.log('local state ', this.state)
    const { players, positions, matchId, userId } = this.state
    const { classes } = this.props;
    const mappedPlayers = Object.keys(positions)
      .map((player, idx) => (
        <div key={`invite${idx}`}>
          <CheckIcon className={classes.mainFill} />
          {positions[player].role} {positions[player].userId === userId ? '(You)' : null}
        </div>))


    return <Fragment>
      <Paper className="MuiPaper-customPrimary">
        <Typography variant="h4">Match Id: {matchId}</Typography>
        {document.queryCommandSupported('copy') && <textarea
          readOnly
          ref={(textarea) => this.textArea = textarea}
          style={{ opacity: '0', position: 'absolute' }}
          value={this.state.matchId} />}

        <ServerPing ping={this.ping} />

        {/* <UserDisplay onJoin={this.setUser} RS={players.RS} RF={players.RF} BS={players.BS} BF={players.BF} Host={players.Host} thisUser={this.state.userId} /> */}

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
