import React, { Component, Fragment } from "react";

import { Typography, Paper, Button, FormLabel, TextField, Grid, List, ListItem, Input, Select } from "@material-ui/core";

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

const words = [
  "pair",
  "straw",
  "scientist",
  "over",
  "tell",
  "creature",
  "story",
  "entirely",
  "building",
  "sweet",
  "went",
  "continent",
  "pile",
  "movement",
  "camp",
  "add",
  "substance",
  "again",
  "take",
  "clock",
  "border",
  "gone",
  "wrote",
  "equator",
  "case"
]

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.messages = [
      "First",
      "Second",
      "Third"
    ];
    this.currentMsg = "hi";
    this.numWords = 1;
    this.matchID = this.props.matchID;
    this.userID = this.props.userID;
    this.position = this.props.position;
  }

  setCurrentMsg(msg) {
    this.currentMsg = msg;
  }

  setNumWords(num) {
    this.numWords = num;
  }

  sendCurrentMsg() {
    if (this.currentMsg == "") return;
    const word = this.currentMsg;
    const numWords = this.numWords;
    this.messages.push(this.currentMsg);
    this.currentMsg = "";

    var spyHintReq = new XMLHttpRequest();
    spyHintReq.open('POST', 'https://localhost:3001/matches/' + this.matchID + "/nextmove");
    spyHintReq.setRequestHeader("Content-Type", "application/json");
    spyHintReq.onreadystatechange = function () {
      if (spyHintReq.readyState === 4 && spyHintReq.status === 200) {
        var json = JSON.parse(spyHintReq.responseText);
        alert(json);
      }
    };
    var data = JSON.stringify({ "userId": this.userID, "position": this.position, "move": (this.numWords + " " + this.currentMsg) });
    spyHintReq.send(data);
    this.forceUpdate();
  }

  render() {
    const text = this.messages.map((step, index) => {
      return (<ListItem>{step}</ListItem>);
    });
    return (
      <Paper style={{ maxHeight: 300, overflow: 'auto' }}>
        <List>
          {text}
        </List>
        #
        <Input onChange={event => this.setNumWords(event.target.value)} style={{ width: 20 }}>
        </Input>
        Hint
        <Input onChange={event => this.setCurrentMsg(event.target.value)}>
        </Input>
        <Button onClick={() => this.sendCurrentMsg()} style={{ height: 30 }} color='primary' variant='contained'>
          Submit Hint
        </Button>
      </Paper>
    );
  }
}

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
    this.forceUpdate();
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
          <ChatBox matchID={this.matchID} userID={this.userID} position={this.position}></ChatBox>
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
