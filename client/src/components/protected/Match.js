import React, { Component, Fragment } from "react";
import { Paper, Grid, Button, Typography } from "@material-ui/core";

import MappedWords from './MappedWords'

import auth from '../auth/auth'

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
      words: [],
      position: 'RF'
    }
  }
  componentDidMount = () => {
    if (this.props.location.state == null || this.props.match.params.matchId !== this.props.location.state.matchId) {
      this.props.history.push('/welcome')
    }
    const { matchId, matchState } = this.props.location.state
    console.log(matchState)

    const words = matchState.info.map(word => ({ val: word, chosen: false }))

    this.setState({ ...this.state, matchId, words })
  }

  clickWord = async (e) => {
    const { words, matchId } = this.state

    let index = e.currentTarget.dataset.tag;
    words[index].chosen = true;
    try {
      const reqBody = JSON.stringify({
        userID: auth.getUserInfo().id,
        position: this.state.position,
        move: e.target.firstChild
      })

      let res = await fetch(`/matches/${matchId}/nextmove`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
        body: reqBody
      })
      res = await res.json()
      console.log(res)
      this.setState({ ...this.state, words })
    } catch (error) {
      console.log('error @ API /matches/:matchId/nextmove')
    }
  }

  endFieldTurn = async () => {
    try {
      const reqBody = JSON.stringify({
        userID: auth.getUserInfo().id,
        position: this.state.position,
        move: "_END"
      })

      let res = await fetch(`/matches/${this.state.matchId}/nextmove`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
        body: reqBody
      })
      res = await res.json()
      console.log(res)

      let position = this.nextPosition
      this.setState({ ...this.state, position })
    } catch (error) {
      console.log('error @ API /matches/:matchId/nextmove to end turn')
    }
  }

  nextPosition = () => {
    let { position } = this.state
    position = position === "RF" ? "BF" : "RF"
    return position
  }

  render() {
    const { classes } = this.props;
    const { words, position } = this.state;
    return (<Fragment>
      <Grid container spacing={0} className={classes.gridContainer}>
        <Grid item xs={4}>
          <Paper>
            Chat
        </Paper>
        </Grid>
        <Paper className={`${classes.paper} ${classes.centerText}`}>
          <Typography variant="h4">{position === "RF" ? "Red" : "Blue"} Field Agent turn</Typography>
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
