import React, { Component, Fragment } from "react";
import { Typography, Paper, Button, FormLabel, TextField, Grid, List, ListItem, Input, Select } from "@material-ui/core";

import MappedWords from './MappedWords'
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
  standardFlexChild: {
    flexGrow: '1',
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
    if (this.currentMsg=="") return;
    const word = this.currentMsg;
    const numWords = this.numWords;
    this.messages.push(this.currentMsg);
    this.currentMsg = "";

    var spyHintReq = new XMLHttpRequest();
    spyHintReq.open('POST', 'https://localhost:3001/matches/'+this.matchID+"/nextmove");
    spyHintReq.setRequestHeader("Content-Type", "application/json");
    spyHintReq.onreadystatechange = function () {
        if (spyHintReq.readyState === 4 && spyHintReq.status === 200) {
            var json = JSON.parse(spyHintReq.responseText);
            alert(json);
        }
    };
    var data = JSON.stringify({"userId": this.userID, "position": this.position, "move":(this.numWords + " "+this.currentMsg)});
    spyHintReq.send(data);
    this.forceUpdate();
  }

	render() {
    const text = this.messages.map((step,index)=>{
      return (<ListItem>{step}</ListItem>);
    });
		return (
			<Paper style={{maxHeight: 300, overflow: 'auto'}}>
        <List>
          {text}
        </List>
        #
        <Input onChange={event=>this.setNumWords(event.target.value)} style={{width:20}}>
        </Input>
        Hint
        <Input onChange={event=>this.setCurrentMsg(event.target.value)}>
        </Input>
        <Button onClick={()=>this.sendCurrentMsg()} style={{height: 30}} color='primary' variant='contained'>
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
      matchId: ''
    }
  }
  componentDidMount = () => {
    if (this.props.location.state == null || this.props.match.params.matchId !== this.props.location.state.matchId) {
      this.props.history.push('/welcome')
    }
    const { matchId } = this.props.location.state
    this.setState({ ...this.state, matchId })
    this.forceUpdate();
  }

  render() {
    const { classes } = this.props;
    return (<Fragment>
      <Grid container spacing={2} className={classes.gridContainer}>
        <Grid item xs={4}>
          <ChatBox matchID={this.matchID} userID={this.userID} position={this.position}></ChatBox>
        </Grid>
        <Grid item xs={8}>
          <Paper>
            <MappedWords words={words} />
          </Paper>
        </Grid>
      </Grid>
    </Fragment>)
  }
}

export default withStyles(style)(Match)
