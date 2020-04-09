import React, { Component, Fragment } from "react";

import { Typography, Paper, Button, Grid } from "@material-ui/core";

import MappedWords from './MappedWords'
import ChatBox from './ChatBox'

import auth from '../auth/auth'
import matchDictionary from './matchDictionary'


import { withStyles } from "@material-ui/styles";

const style = (theme) => ({
  centerText: {
    textAlign: 'center',
    marginBottom: "0.5em"
  },
  leftText: {
    textAlign: 'left'
  },
  gridContainer: {
    flexWrap: "wrap",
    justifyContent: "space-around",
    margin: "10px auto"
  },
  standardFlex: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  flexRow: {
    margin: "10px",
    justifyContent: 'space-evenly',
    '&>.MuiGrid-item': {
      '&>button': {
        width: '100%'
      }
    }
  },
  standardFlexChild: {
    flexGrow: '1',
  },
  paper: {
    margin: "50px auto",
    padding: "20px",
    maxWidth: "700px",
  },
  chosen_false: {
    backgroundColor: '#3FBF8A'
  },
  chosen_true: {
    backgroundColor: '#B319EB'
  }
});

class Match extends Component {
  constructor(props) {
    super(props)
    this.state = {
      matchId: '',
      userId: '',
      words: [],
      positionState: ""
    }
    this.submitHint = this.submitHint.bind(this)
  }
  componentDidMount = () => {
    if (this.props.location.state == null || this.props.match.params.matchId !== this.props.location.state.matchId) {
      this.props.history.push('/welcome')
    }
    const { matchId, matchState } = this.props.location.state
    console.log('\n\nmatchState', matchState)

    const words = matchState.info.map(word => ({ val: word, chosen: false }))

    this.setState({
      ...this.state,
      matchId,
      words,
      userId: auth.getUserInfo().id,
      positionState: matchState.state
    })
    this.forceUpdate();
  }

  clickWord = async (e) => {
    const { words, matchId, positionState } = this.state

    let index = e.currentTarget.dataset.tag;
    words[index].chosen = true;
    try {
      const reqBody = JSON.stringify({
        userID: auth.getUserInfo().id,
        position: matchDictionary[positionState],
        move: e.target.firstChild
      })

      let res = await fetch(`/matches/${matchId}/nextmove`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
        body: reqBody
      })
      res = await res.json()
      console.log('\nclickword', res)
      this.setState({ ...this.state, words })
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

      let res = await fetch(`/matches/${this.state.matchId}/nextmove`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
        body: reqBody
      })
      res = await res.json()
      console.log('\n end field turn', res)

      let positionState = res.info.state
      this.setState({ ...this.state, positionState })
    } catch (error) {
      console.log('error @ API /matches/:matchId/nextmove to end turn')
    }
  }

  async submitHint(move) {
    console.log(move)
    const reqBody = JSON.stringify({
      userID: auth.getUserInfo().id,
      position: matchDictionary[this.state.positionState],
      move
    })

    try {
      let res = await fetch(`/matches/${this.state.matchId}/nextmove`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
        body: reqBody
      })
      res = await res.json()
      console.log('\n hint submmitted', res)

      let positionState = `${res.state}`

      console.log('\n positionState', positionState)
      this.setState({ ...this.state, positionState })
    } catch (error) {
      console.log('error @ submitHint API')
    }
  }

  render() {
    console.log('state', this.state)
    const { classes } = this.props;
    const { words, positionState, matchId, userId } = this.state;
    return (<Fragment>
      <Grid container spacing={0} className={classes.gridContainer}>
        <Grid item xs={4}>
          <ChatBox
            submitHint={this.submitHint}
            matchID={matchId}
            userID={userId}
            position={matchDictionary[positionState]} />
        </Grid>
        <Paper className={`${classes.paper} ${classes.centerText}`}>
          <Typography variant="h4">{positionState}</Typography>
          <Grid container item xs={12} className={classes.standardFlex}>
            <MappedWords classes={classes} words={words} clickWord={this.clickWord} />
          </Grid>
          <Button variant="outlined" onClick={this.endFieldTurn}>End Turn</Button>
        </Paper>
      </Grid>
    </Fragment>)
  }
}

export default withStyles(style)(Match)
