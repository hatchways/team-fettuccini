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

class Match extends Component {
  constructor(props) {
    super(props)
    this.state = {
      matchId: '',
      userId: auth.getUserInfo().id,
      words: [],
      positionState: "",
      guessesLeft: 0
    }
    this.submitHint = this.submitHint.bind(this)
    this.ping = this.ping.bind(this)
    this.userDisplay = React.createRef();
  }

  componentDidMount = () => {
    if (this.props.location.state == null || this.props.match.params.matchId !== this.props.location.state.matchId) {
      this.props.history.push('/welcome')
    }
    const { matchId, matchState } = this.props.location.state
    console.log('\n\nmatchState', matchState)

    this.setState({
      ...this.state,
      matchId: matchId,
      words: matchState.info,
      positionState: matchState.state
    })
  }

  async ping() {
    if (this.state.words.length === 0) {
      return
    }

    let { matchId, userId, positionState, words } = this.state
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
      console.log('\n API PING.json', res)

      let updateState = false
      let i = 0

      for (let i = 0; i < words.length; i++) {
        if (words[i].slice(0, 2) !== res.info[i].slice(0, 2)) {
          updateState = true
          words[i] = res.info[i].slice(0, 2) + words[i]
        }
      }

      if (updateState || (res.state !== positionState)) {
        this.setState({
          positionState: res.state,
          words
        })
      }
    } catch (error) {
      console.log('error @ PING .json() \n', error)
    }
  }

  clickWord = async (e) => {

    try {
      let { matchId, positionState, guessesLeft, words } = this.state
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
        guessesLeft--

        console.log('res state', res.info.state)
        this.setState({ ...this.state, words, guessesLeft, positionState: res.info.state })

      }
    } catch (error) {
      console.log('error @ API /matches/:matchId/nextmove')
    }
  }

  endFieldTurn = async () => {
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

      let positionState = res.info.state
      this.setState({ ...this.state, positionState, guessesLeft: 0 })
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
      this.setState({ ...this.state, positionState, guessesLeft: Number(move.num) })
    } catch (error) {
      console.log('error @ submitHint API')
    }
  }

  render() {
    console.log('local state', this.state)
    const { classes } = this.props;
    const { words, positionState, matchId, userId, guessesLeft } = this.state;
    return (<Fragment>
      <Grid container spacing={0} className={classes.gridContainer}>
        <Grid item xs={4}>
          <UserDisplay thisUser={this.state.userId} ref={this.userDisplay}/>
        </Grid>
        <Grid item xs={4}>
          <ChatBox
            submitHint={this.submitHint}
            matchID={matchId}
            userID={userId}
            position={matchDictionary[positionState]} />
        </Grid>
        <Paper className={`${classes.paper} ${classes.centerText}`}>
          <Typography variant="h4">{positionState}</Typography>
          <ServerPing ping={this.ping} />
          {(matchDictionary[positionState] === "RF" || matchDictionary[positionState] === "BF") ? <p>{guessesLeft} guesses left</p> : null}
          <Grid container item xs={12} className={classes.standardFlex}>
            <MappedWords classes={classes} words={words} clickWord={this.clickWord} />
          </Grid>
          <Button variant="outlined" onClick={this.endFieldTurn}>End Turn</Button>
        </Paper>
      </Grid>
    </Fragment>)
  }
}

export default withStyles(styleMatch)(Match)
