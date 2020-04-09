import React, { Component, Fragment } from "react";

import { Typography, Paper, Button, FormLabel, TextField, Grid, List, ListItem, Input, Select } from "@material-ui/core";


import auth from '../auth/auth'

export default class ChatBox extends React.Component {
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
    spyHintReq.open('POST', '/matches/' + this.props.matchID + "/nextmove");
    spyHintReq.setRequestHeader("Content-Type", "application/json");
    spyHintReq.onreadystatechange = function () {
      if (spyHintReq.readyState === 4 && spyHintReq.status === 200) {
        var json = JSON.parse(spyHintReq.responseText);
        alert(json);
        console.log(json)
      }
    };
    var data = JSON.stringify({
      "userID": this.props.userID,
      "position": this.props.position,
      "move": (this.numWords + " " + this.currentMsg)
    });
    console.log('data', data)
    spyHintReq.send(data);
    this.forceUpdate();
  }

  render() {
    const text = this.messages.map((step, index) => {
      return (<ListItem key={`msg-${index}`}>{step}</ListItem>);
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
